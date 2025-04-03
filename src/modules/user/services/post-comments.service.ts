import {BadRequestException, Injectable} from "@nestjs/common";
import {CreatePostCommentDto} from "../dto/create-post-comment.dto";
import {PostCommentRepository} from "../repositories/post-comment.repository";
import {UserPostRepository} from "../repositories/user-post.repository";
import {PostCommentEntity} from "../entities/post-comment.entity";
import {UpdatePostCommentDto} from "../dto/update-post-comment.dto";
import defineAbilityForUser, {Action} from "../../casl/casl-ability.factory";
import {ForbiddenError} from "@casl/ability";
import {Paginated, PaginateQuery} from "nestjs-paginate";
import {PostEntity} from "../entities/post.entity";

@Injectable()
export class PostCommentsService {

    constructor(
        private readonly postCommentRepository: PostCommentRepository,
        private readonly userPostRepository: UserPostRepository
    ) {
    }

    /**
     * @param postId
     * @param userId
     * @param createPostCommentDto
     */
    async createComment(postId: number, userId: number, createPostCommentDto: CreatePostCommentDto): Promise<PostCommentEntity> {
        const post = await this.userPostRepository.findById(postId);
        if (!post) {
            throw new BadRequestException('Post not found');
        }
        return await this.postCommentRepository.create(userId, {...createPostCommentDto, postId});
    }

    /**
     * @param authUserId
     * @param postId
     * @param commentId
     * @param updatePostCommentDto
     */
    async manageComment(authUserId: number, postId: number, commentId: number, updatePostCommentDto?: UpdatePostCommentDto): Promise<void> {
        const comment = await this.postCommentRepository.findById(commentId, ['user', 'post']);
        const post = await this.userPostRepository.findById(postId);
        if (!comment || !post) {
            throw new BadRequestException('Comment or post not found');
        }
        if (comment.post.id !== postId) {
            throw new BadRequestException('This comment belongs to another post');
        }
        const ability = defineAbilityForUser({userId: authUserId});
        ForbiddenError.from(ability)
            .setMessage('You can not manage comments that don\'t belongs to you')
            .throwUnlessCan(Action.MANAGE, comment);
        if (!updatePostCommentDto) {
            await this.postCommentRepository.delete(commentId);
            return;
        }

        await this.postCommentRepository.update(comment.id, updatePostCommentDto);
    }

    /**
     * @param postId
     * @param commentId
     * @param query
     */
    async paginate(postId: number, query: PaginateQuery, commentId?: number): Promise<Paginated<PostCommentEntity>> {
        const post: PostEntity | null = await this.userPostRepository.findById(postId);
        if (!post) {
            throw new BadRequestException('Post no found');
        }
        if (commentId) {
            const comment: PostCommentEntity | null = await this.postCommentRepository.findById(commentId);
            if (!comment) {
                throw new BadRequestException('Comment not found')
            }
        }

        return await this.postCommentRepository.paginate(postId, query, commentId);
    }
}