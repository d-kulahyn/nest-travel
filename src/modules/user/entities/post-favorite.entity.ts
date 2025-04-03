import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity({name: 'post_favorites', synchronize: false})
export class PostFavoriteEntity {

    @Column()
    @PrimaryColumn()
    userId: number;

    @Column()
    @PrimaryColumn()
    postId: number;
}