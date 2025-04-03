import {Injectable} from "@nestjs/common";
import {EntityManager, Repository} from "typeorm";
import {PostEntity} from "../entities/post.entity";
import {CreatePostDto} from "../dto/create-post.dto";
import {paginate} from "nestjs-paginate";
import {Paginated, PaginateQuery} from "nestjs-paginate";
import {postPaginationConfig} from "../../../pagination/post-pagination.config";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {PostLikeEntity} from "../entities/post-like.entity";
import {PostFavoriteEntity} from "../entities/post-favorite.entity";
import {PostViewEntity} from "../entities/post-view.entity";

@Injectable()
export class UserPostRepository {

    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(PostEntity) private readonly repository: Repository<PostEntity>,
        @InjectRepository(PostLikeEntity) private readonly postLikeRepository: Repository<PostLikeEntity>,
        @InjectRepository(PostFavoriteEntity) private readonly postFavoriteRepository: Repository<PostFavoriteEntity>
    ) {
    }

    /**
     * @param createPostDto
     */
    async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
        const post = this.repository.create(createPostDto);
        return await this.repository.save<PostEntity>(post, {reload: true})
    }

    /**
     * @param postId
     * @param relations
     */
    async findById(postId: number, relations?: string[]): Promise<PostEntity | null> {
        return this.repository.findOne({where: {id: postId}, relations: relations});
    }

    /**
     * @param postId
     */
    async deletePost(postId: number): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .delete()
            .where({id: postId})
            .execute();
    }

    /**
     * @param postId
     * @param data
     */
    async update(postId: number, data: Partial<PostEntity>): Promise<void> {
        await this.repository.update(postId, data);
    }

    /**
     * @param post
     */
    async save(post: Partial<PostEntity>): Promise<PostEntity> {
        return await this.repository.save(post);
    }

    /**
     * @param userId
     * @param query
     */
    async paginate(userId: number, query: PaginateQuery): Promise<Paginated<PostViewEntity>> {
        const queryBuilder = this.entityManager.createQueryBuilder(PostViewEntity, 'posts')
            .where('posts.userId = :userId', {userId})
            .leftJoinAndSelect('posts.likes', 'likes')
            .innerJoinAndSelect('posts.user', 'pu')
            .leftJoinAndSelect('posts.comments', 'comments')
            .leftJoinAndSelect('comments.user', 'user');
        return paginate(query, queryBuilder, postPaginationConfig)
    }

    /**
     * @param userId
     * @param postId
     */
    async isLikedByUser(userId: number, postId: number): Promise<boolean> {
        return !!(await this.postLikeRepository.findOneBy({userId, postId}));
    }

    /**
     * @param postId
     * @param userId
     */
    async isInFavorites(postId: number, userId: number): Promise<boolean> {
        return !!(await this.postFavoriteRepository.findOne({where: {postId, userId}}));
    }
}