import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {PostLikeEntity} from "../entities/post-like.entity";
import {Repository} from "typeorm";
import {PostEntity} from "../entities/post.entity";
import {UserPostRepository} from "../repositories/user-post.repository";
import {Action} from "../../casl/casl-ability.factory";
import {User} from "../../auth/decorators/user.decorator";
import {AuthUser} from "../../auth/types/auth-user";

@Injectable()
export class PostLikeService {
    constructor(
        @InjectRepository(PostLikeEntity) private readonly postLikeRepository: Repository<PostLikeEntity>,
        private readonly userPostRepository: UserPostRepository
    ) {
    }

    /**
     * @param postId
     * @param authUserId
     * @param action
     */
    async manageLike(postId: number, authUserId: number, action?: Action): Promise<PostLikeEntity | null> {
        const post: PostEntity | null = await this.userPostRepository.findById(postId);
        if (!post) {
            throw new BadRequestException('Post not found');
        }
        const like: PostLikeEntity | null = await this.postLikeRepository.findOne({
            where: {
                postId,
                userId: authUserId
            }
        });
        if (action === Action.DELETE) {
            if (!like) {
                throw new BadRequestException('You didn\'t like this post');
            }
            await this.postLikeRepository.remove(like);
            return null;
        }
        if (like) {
            throw new BadRequestException('You have already liked this post');
        }
        const newLike = this.postLikeRepository.create({userId: authUserId, postId});
        return await this.postLikeRepository.save(newLike, {reload: true});
    }

    /**
     * @param postId
     * @param user
     */
    async isPostLikedByUser(postId: number, @User() user?: AuthUser): Promise<boolean> {
        const post: PostEntity | null = await this.userPostRepository.findById(postId);
        if (!post) {
            throw new BadRequestException('Post not found');
        }
        return post.userId === user?.userId;
    }
}