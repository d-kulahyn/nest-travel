import {DataSource, ViewColumn, ViewEntity} from "typeorm";
import {PostEntity} from "./post.entity";
import {PostCommentEntity} from "./post-comment.entity";
import {PostLikeEntity} from "./post-like.entity";
import {UserEntity} from "./user.entity";

@ViewEntity({
    synchronize: false,
    name: 'post_view',
    expression: (dataSource: DataSource) => dataSource
        .createQueryBuilder(PostEntity, 'post')
        .select('post.id', 'id')
        .addSelect('post.description', 'description')
        .addSelect('post.place', 'place')
        .addSelect('post.showComments', 'showComments')
        .addSelect('post.userId', 'userId')
        .addSelect((qb) => qb
                .select('COUNT(pc.id)')
                .where('pc.postId = post.id')
                .from(PostCommentEntity, 'pc'),
            'countOfComments')
        .addSelect((qb) => qb
                .select('COUNT(*)')
                .where('pl.postId = post.id')
                .from(PostLikeEntity, 'pl'),
            'countOfLikes')
})
export class PostViewEntity {

    @ViewColumn()
    id: number;

    @ViewColumn()
    description: string;

    @ViewColumn()
    place: string;

    @ViewColumn()
    showComments: boolean;

    @ViewColumn()
    countOfComments: number;

    @ViewColumn()
    countOfLikes: number;

    @ViewColumn()
    userId: number;
}