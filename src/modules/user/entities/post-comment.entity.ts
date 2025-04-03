import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {PostEntity} from "./post.entity";
import {Exclude} from "class-transformer";
import {UserEntity} from "./user.entity";

@Entity({name: 'post_comments'})
export class PostCommentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text", nullable: false})
    text: string;

    @ManyToOne(() => PostEntity, (post) => post.comments, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    post: PostEntity;

    @ManyToOne(() => PostCommentEntity, (comment) => comment.replies, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    parent: PostCommentEntity;

    @OneToMany(() => PostCommentEntity, (comment) => comment.parent)
    replies: PostCommentEntity[];

    @Column({nullable: true, default: null})
    @Exclude()
    parentId: number

    @ManyToOne(() => UserEntity, (user) => user.comments, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    user: UserEntity

    @Column({nullable: false})
    @Exclude()
    userId: number;

    @Column({nullable: false})
    @Exclude()
    postId: number;

    @CreateDateColumn({type: "timestamp"})
    @Exclude()
    createDate: Date;

    @UpdateDateColumn({type: "timestamp"})
    @Exclude()
    updatedDate: Date;
}