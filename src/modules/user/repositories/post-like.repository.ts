import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {PostLikeEntity} from "../entities/post-like.entity";
import {Repository} from "typeorm";

@Injectable()
export class PostLikeRepository {
    constructor(@InjectRepository(PostLikeEntity) private readonly repository: Repository<PostLikeEntity>) {
    }

    /**
     * @param postId
     * @param take
     */
    async getUsersIdsByPost(postId: number, take: number = 10): Promise<number[]> {
        let userIds = await this.repository
            .createQueryBuilder('pl')
            .select('pl."userId"')
            .take(take)
            .getRawMany();

        return userIds.map((user) => user.userId);
    }

    /**
     * @param postId
     */
    async getCountOfLikesByPost(postId: number): Promise<number> {
        return await this.repository.countBy({postId});
    }
}