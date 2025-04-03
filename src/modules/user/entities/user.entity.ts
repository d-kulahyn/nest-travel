import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany, ManyToOne
} from "typeorm";
import {IsEmail, IsNotEmpty} from "class-validator";
import {Exclude} from "class-transformer";
import {FileEntity} from "../../../entities/file.entity";
import {PostEntity} from "./post.entity";
import {PostCommentEntity} from "./post-comment.entity";

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true, unique: true})
    login: string;

    @Column({nullable: true, unique: true})
    @IsEmail()
    @Exclude()
    oldEmail: string;

    @Column({nullable: true, unique: true})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @OneToOne(() => FileEntity, {
        createForeignKeyConstraints: false
    })
    @JoinColumn({
        name: 'avatarId',
        referencedColumnName: 'id',
    })
    avatar?: FileEntity;

    @Column({nullable: true})
    @Exclude()
    avatarId: number;

    @Column({nullable: true})
    @Exclude()
    password: string;

    @Column({type: "text", nullable: true})
    aboutMe: string;

    @Column({nullable: true, unique: true})
    telephone: string;

    @Column({nullable: true})
    myWebsite: string;

    @Column({default: true})
    @Exclude()
    isActive: boolean;

    @Column({default: null})
    @Exclude()
    social: string;

    @ManyToMany(() => UserEntity, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinTable({
        name: 'user_friendships',
        joinColumn: {
            name: 'followerId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        }
    })
    followings?: UserEntity[];

    @ManyToMany(() => UserEntity, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinTable({
        name: 'user_friendships',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'followerId',
            referencedColumnName: 'id'
        }
    })
    followers?: UserEntity[];

    @ManyToMany(() => PostEntity, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinTable({
        name: 'post_favorites',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'postId',
            referencedColumnName: 'id'
        }
    })
    favorites?: PostEntity[];

    @OneToMany(() => PostEntity, (post) => post.user)
    posts?: PostEntity[];

    @OneToMany(() => PostCommentEntity, (comment) => comment.user)
    comments?: PostCommentEntity;

    @Column({type: "timestamp", nullable: true, default: null})
    @Exclude()
    emailVerifiedAt: Date | null;

    @Column({type: "timestamp", nullable: true, default: null})
    @Exclude()
    passwordChangedAt: Date;

    @CreateDateColumn({type: "timestamp"})
    @Exclude()
    createDate: Date;

    @UpdateDateColumn({type: "timestamp"})
    @Exclude()
    updatedDate: Date;

    @DeleteDateColumn({type: "timestamp"})
    @Exclude()
    deletedDate: Date;
}
