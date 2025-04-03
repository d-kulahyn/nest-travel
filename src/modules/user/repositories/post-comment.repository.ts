import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PostCommentEntity} from "../entities/post-comment.entity";
import {Paginated, PaginateQuery} from "nestjs-paginate";
import {paginate} from "nestjs-paginate";
import {postCommentPaginationConfig} from "../../../pagination/post-comment-pagination.config";

@Injectable()
export class PostCommentRepository {

    constructor(@InjectRepository(PostCommentEntity) private readonly repository: Repository<PostCommentEntity>) {
    }

    /**
     * @param userId
     * @param postComment
     */
    async create(userId: number, postComment: Partial<PostCommentEntity>): Promise<PostCommentEntity> {
        const comment = this.repository.create({...postComment, userId});
        return await this.repository.save<PostCommentEntity>(comment, {reload: true});
    }

    /**
     * @param commentId
     * @param relations
     */
    async findById(commentId: number, relations?: string[]): Promise<PostCommentEntity | null> {
        return await this.repository.findOne({where: {id: commentId}, relations: relations});
    }

    /**
     * @param postId
     * @param take
     */
    async findByPostId(postId: number, take: number = 10): Promise<PostCommentEntity[]> {
        return await this.repository.find({where: {postId}, take});
    }

    /**
     * @param commentId
     */
    async delete(commentId: number): Promise<void> {
        await this.repository.delete(commentId);
    }

    /**
     * @param commentId
     * @param data
     */
    async update(commentId: number, data: Partial<PostCommentEntity>) {
        return this.repository.update(commentId, data)
    }

    /**
     * @param postId
     */
    async getCountByPost(postId: number): Promise<number> {
        return await this.repository.countBy({postId})
    }

    /**
     * @param postId
     * @param query
     * @param commentId
     */
    async paginate(postId: number, query: PaginateQuery, commentId?: number): Promise<Paginated<PostCommentEntity>> {
        const queryBuilder = this.repository.createQueryBuilder('comments')
            .where('comments.postId = :postId', {postId})
            .leftJoinAndSelect('comments.parent', 'parent')
            .leftJoinAndSelect('comments.replies', 'replies')
            .leftJoinAndSelect('replies.user', 'userReply')
            .leftJoinAndSelect('comments.user', 'user');
        if (commentId) {
            queryBuilder
                .where('comments.parentId = :commentId', {commentId})
        }
        return paginate(query, queryBuilder, postCommentPaginationConfig)
    }
}