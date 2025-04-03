import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {EntityManager, In, Repository, UpdateResult} from "typeorm";
import {CreateUserDto} from "../dto/create-user.dto";
import {genSalt, hash} from "bcryptjs";
import {paginate, Paginated, PaginateQuery} from "nestjs-paginate";
import {UserFriendshipEntity} from "../entities/user-friendship.entity";
import {PostEntity} from "../entities/post.entity";
import {UserInfoInterface} from "../interfaces/user-info.interface";
import {FileRepository} from "../../../repositories/file-repository";
import {friendshipPaginationConfig} from "../../../pagination/friendship-pagination.config";
import {FriendshipTypeEnum} from "../enums/friendship-type.enum";
import {postPaginationConfig} from "../../../pagination/post-pagination.config";
import {PostCommentRepository} from "./post-comment.repository";
import {PostLikeRepository} from "./post-like.repository";
import {UserPostRepository} from "./user-post.repository";
import {PostViewEntity} from "../entities/post-view.entity";
import {PostCommentEntity} from "../entities/post-comment.entity";
import {postViewPaginationConfig} from "../../../pagination/post-view-pagination.config";

@Injectable()
export class UserRepository {

    constructor(
        @InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
        private readonly fileRepository: FileRepository,
        private readonly postCommentRepository: PostCommentRepository,
        private readonly postLikeRepository: PostLikeRepository,
        private readonly userPostRepository: UserPostRepository
    ) {
    }

    /**
     * @param email
     */
    async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.repository.findOneBy({email});
    }

    /**
     * @param social
     */
    async findBySocial(social: string): Promise<UserEntity | null> {
        return await this.repository.findOneBy({social})
    }

    /**
     * @param userId
     * @param data
     */
    async update(userId: number, data: Partial<UserEntity>): Promise<void> {
        await this.repository.update(userId, data);
    }

    /**
     * @param createUserDto
     */
    async createUser(createUserDto: Partial<CreateUserDto>): Promise<UserEntity> {
        if (createUserDto.password) {
            createUserDto.password = await hash(createUserDto.password, await genSalt());
        }
        const user = this.repository.create({...createUserDto, oldEmail: createUserDto.email});
        await this.repository.save<UserEntity>(user, {reload: true});

        return user;
    }

    /**
     * @param login
     */
    async findByLogin(login: string): Promise<UserEntity | null> {
        return await this.repository.findOneBy({login})
    }

    /**
     * @param userId
     */
    async updateVerifiedAt(userId: number): Promise<UpdateResult> {
        return await this.repository.update(userId, {emailVerifiedAt: new Date()});
    }

    /**
     * @param userId
     * @param relations
     */
    async findById(userId: number, relations?: string[]): Promise<UserEntity | null> {
        return await this.repository.findOne({where: {id: userId}, relations: relations});
    }

    /**
     * @param ids
     */
    async findByIds(ids: number[]): Promise<UserEntity[]> {
        return await this.repository.find({where: {id: In(ids)}});
    }

    /**
     * @param userId
     * @param followerId
     */
    async attachFriendship(userId: number, followerId: number): Promise<void> {
        await this.entityManager
            .getRepository(UserFriendshipEntity)
            .createQueryBuilder()
            .insert()
            .into(UserFriendshipEntity)
            .values([{followerId, userId}])
            .execute();
    }

    /**
     * @param userId
     * @param followerId
     */
    async detachFriendship(userId: number, followerId: number): Promise<void> {
        await this.entityManager
            .getRepository(UserFriendshipEntity)
            .createQueryBuilder()
            .delete()
            .from(UserFriendshipEntity)
            .where('followerId = :followerId', {followerId})
            .andWhere('userId = :userId', {userId})
            .execute();
    }

    /**
     * return Promise<{id: number} | null>
     */
    async getLastUser(): Promise<{ id: number } | null> {
        return await this.repository.createQueryBuilder('u')
            .select('u.id')
            .orderBy('u.id', 'DESC')
            .take(1).getOne();
    }

    /**
     * @param userId
     * @param authUserid
     */
    async getUserInfo(userId: number, authUserid: number): Promise<UserInfoInterface> {
        const result = await this.repository.createQueryBuilder('u')
            .select('u.avatar', 'avatar')
            .addSelect('u.login', 'login')
            .addSelect('u.name', 'name')
            .addSelect((qb) => qb
                    .select('COUNT(up.userId)')
                    .where('up.userId = :userId', {userId})
                    .from(PostEntity, 'up'),
                'countOfPosts'
            )
            .addSelect((qb) => qb
                    .select('true')
                    .from(UserFriendshipEntity, 'uf')
                    .where('uf.followerId = :followerId', {followerId: authUserid})
                    .andWhere('uf.userId = :userId', {userId}),
                'isFollowed'
            )
            .addSelect((qb) => qb
                    .select('COUNT(uf.followerId)')
                    .from(UserFriendshipEntity, 'uf')
                    .where('uf.followerId = :followerId', {followerId: userId}),
                'countOfFollowers'
            )
            .addSelect((qb) => qb
                    .select('COUNT(uf.followerId)')
                    .from(UserFriendshipEntity, 'uf')
                    .where('uf.userId = :userId', {userId}),
                'countOfFollowings'
            )
            .where('u.id = :id', {id: userId})
            .getRawOne();

        const avatar = await this.fileRepository.findById(result.avatar);

        return {
            avatar,
            login: result.login,
            name: result.name,
            countOfPosts: Number(result.countOfPosts),
            isFollowed: Boolean(result.isFollowed),
            countOfFollowers: Number(result.countOfFollowers),
            countOfFollowings: Number(result.countOfFollowings)
        }
    }

    /**
     * @param userId
     * @param query
     * @param friendship
     */
    async paginate(userId: number, query: PaginateQuery, friendship?: FriendshipTypeEnum): Promise<Paginated<UserEntity>> {
        const queryBuilder = this.repository
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.avatar', 'avatar');

        if (friendship === FriendshipTypeEnum.FOLLOWINGS) {
            queryBuilder.innerJoin('user_friendships', 'uf', 'uf.followerId = u.id')
                .where('uf.userId = :userId', {userId});
        } else if (friendship === FriendshipTypeEnum.FOLLOWERS) {
            queryBuilder.innerJoin('user_friendships', 'uf', 'uf.userId = u.id')
                .where('uf.followerId = :userId', {userId});
        }

        return paginate(query, queryBuilder, friendshipPaginationConfig)
    }

    /**
     * @param userId
     * @param query
     */
    async feeds(userId: number, query: PaginateQuery): Promise<Paginated<PostEntity>> {
        const user: UserEntity | null = await this.repository.findOneBy({id: userId});
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const feeds = this.entityManager
            .getRepository(PostEntity)
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.user', 'user')
            .innerJoin((qb) => qb
                    .select()
                    .from(UserFriendshipEntity, 'uf')
                    .where('uf.followerId = :followerId', {followerId: userId})
                , 'pf', 'pf."userId" = p."userId"');

        const result = await paginate(query, feeds, postViewPaginationConfig);

        await Promise.all(result.data.map(async (post) => {
            post.comments = await this.postCommentRepository.findByPostId(post.id);
            post.likes = await this.findByIds(await this.postLikeRepository.getUsersIdsByPost(post.id));
            post.countOfLikes = await this.postLikeRepository.getCountOfLikesByPost(post.id);
            post.countOfComments = await this.postCommentRepository.getCountByPost(post.id);
            post.isLiked = await this.userPostRepository.isLikedByUser(userId, post.id);
            post.files = await this.fileRepository.getByEntity(post.id, PostEntity.name);
            post.isInFavorites = await this.userPostRepository.isInFavorites(post.id, userId);
        }));

        return result;
    }
}