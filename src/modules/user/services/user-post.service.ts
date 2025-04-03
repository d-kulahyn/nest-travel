import {BadRequestException, Injectable} from "@nestjs/common";
import {CreatePostDto} from "../dto/create-post.dto";
import {PostEntity} from "../entities/post.entity";
import {UserPostRepository} from "../repositories/user-post.repository";
import {FileRepository} from "../../../repositories/file-repository";
import {UserEntity} from "../entities/user.entity";
import {UserRepository} from "../repositories/user-repository";
import {UpdatePostDto} from "../dto/update-post.dto";
import {Paginated, PaginateQuery} from "nestjs-paginate";
import defineAbilityForUser, {Action} from "../../casl/casl-ability.factory";
import {ForbiddenError} from "@casl/ability";
import {PostViewEntity} from "../entities/post-view.entity";

@Injectable()
export class UserPostService {

    constructor(
        private readonly userPostRepository: UserPostRepository,
        private readonly userRepository: UserRepository,
        private readonly fileRepository: FileRepository,
    ) {
    }

    /**
     * @param authUserId
     * @param userId
     * @param createPostDto
     */
    async createPost(authUserId: number, userId: number, createPostDto: CreatePostDto): Promise<PostEntity> {
        const user: UserEntity | null = await this.userRepository.findById(userId);
        if (!user) {
            throw new BadRequestException('User no found');
        }
        const ability = defineAbilityForUser({userId: authUserId});
        ForbiddenError.from(ability).setMessage('You can not createUser posts for other users').throwUnlessCan(Action.CREATE, user);
        const userPost = await this.userPostRepository.createPost({...createPostDto, userId: authUserId});
        await Promise.all([
            this.userPostRepository.save(userPost),
            this.fileRepository.update(createPostDto.filesIds, {
                entityId: userPost.id,
                entityType: PostEntity.name
            })
        ]);

        return userPost;
    }

    /**
     * @param authUserId
     * @param postId
     * @param updatePostDto
     */
    async managePost(authUserId: number, postId: number, updatePostDto?: UpdatePostDto): Promise<void> {
        const post: PostEntity | null = await this.userPostRepository.findById(postId, ['user']);
        if (!post) {
            throw new BadRequestException('Post no found');
        }
        const ability = defineAbilityForUser({userId: authUserId});
        ForbiddenError.from(ability).setMessage('You can not manage posts for other users').throwUnlessCan(Action.MANAGE, post);
        if (!updatePostDto) {
            await Promise.all([
                this.userPostRepository.deletePost(postId),
                this.fileRepository.deleteByEntity(postId, PostEntity.name)
            ])
            return;
        }
        await this.userPostRepository.update(postId, updatePostDto);
    }

    /**
     * @param authUserId
     * @param userId
     * @param query
     */
    async paginate(authUserId: number, userId: number, query: PaginateQuery): Promise<Paginated<PostViewEntity>> {
        const user: UserEntity | null = await this.userRepository.findById(userId);
        if (!user) {
            throw new BadRequestException('User no found');
        }
        const postPagination: Paginated<PostViewEntity> = await this.userPostRepository.paginate(userId, query);
        // await Promise.all(postPagination.data.map(async (post) => {
        //     post.files = await this.fileRepository.getByEntity(post.id, PostEntity.name);
        //     post.isLiked = await this.userPostRepository.isLikedByUser(authUserId, post.id);
        // }));

        return postPagination;
    }
}