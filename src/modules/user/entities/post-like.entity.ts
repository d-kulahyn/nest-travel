import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity({name: 'post_likes'})
export class PostLikeEntity {

    @Column()
    @PrimaryColumn()
    userId: number;

    @Column()
    @PrimaryColumn()
    postId: number;
}