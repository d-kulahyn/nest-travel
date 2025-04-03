import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PostEntity} from "../entities/post.entity";
import {UserPostRepository} from "../repositories/user-post.repository";
import {Action} from "../../casl/casl-ability.factory";
import {PostFavoriteEntity} from "../entities/post-favorite.entity";

@Injectable()
export class PostFavoriteService {
    constructor(
        @InjectRepository(PostFavoriteEntity) private readonly postFavoriteEntityRepository: Repository<PostFavoriteEntity>,
        private readonly userPostRepository: UserPostRepository
    ) {
    }

    /**
     *
     * @param postId
     * @param authUserId
     * @param action
     */
    async manageFavorite(postId: number, authUserId: number, action?: Action): Promise<PostFavoriteEntity | null> {
        const post: PostEntity | null = await this.userPostRepository.findById(postId);
        if (!post) {
            throw new BadRequestException('Post not found');
        }
        const favorite: PostFavoriteEntity | null = await this.postFavoriteEntityRepository.findOne({
            where: {
                postId,
                userId: authUserId
            }
        });
        if (action === Action.DELETE) {
            if (!favorite) {
                throw new BadRequestException("You don\'t have this post in favorites.");
            }
            await this.postFavoriteEntityRepository.remove(favorite);
            return null;
        }
        if (favorite) {
            throw new BadRequestException('You have already added this post to favorites.');
        }
        const newFavorite = this.postFavoriteEntityRepository.create({userId: authUserId, postId});
        return await this.postFavoriteEntityRepository.save(newFavorite, {reload: true});
    }
}