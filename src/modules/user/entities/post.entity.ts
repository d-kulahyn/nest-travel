import {
    Column,
    CreateDateColumn,
    Entity, JoinTable, ManyToMany,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "./user.entity";
import {Exclude} from "class-transformer";
import {FileEntity} from "../../../entities/file.entity";
import {PostCommentEntity} from "./post-comment.entity";

@Entity({name: 'user_posts'})
export class PostEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text'})
    description: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    place: string;

    @Column({type: 'boolean', default: true})
    showComments: boolean;

    @Column()
    @Exclude()
    userId: number;

    @ManyToOne(() => UserEntity, (user) => user.posts, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    user: UserEntity;

    @ManyToMany(() => UserEntity, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinTable({
        name: 'post_likes',
        joinColumn: {
            name: 'postId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        }
    })
    likes?: UserEntity[]

    @OneToMany(() => PostCommentEntity, (comment) => comment.post)
    comments: PostCommentEntity[]

    @CreateDateColumn({type: "timestamp"})
    @Exclude()
    createDate: Date;

    @UpdateDateColumn({type: "timestamp"})
    @Exclude()
    updatedDate: Date;

    countOfLikes?: number;

    countOfComments?: number;

    isLiked?: boolean;

    isInFavorites?: boolean;

    files?: FileEntity[]
}