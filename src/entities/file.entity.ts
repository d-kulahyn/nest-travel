import {
    Column,
    CreateDateColumn,
    Entity,
    UpdateDateColumn,
    PrimaryGeneratedColumn, Unique,
} from "typeorm";
import {Exclude} from "class-transformer";

@Entity({name: 'files'})
export class FileEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    @Exclude()
    entityId: number;

    @Column({nullable: true})
    @Exclude()
    entityType: string;

    @Column({nullable: false})
    path: string

    @Column({nullable: false})
    mimeType: string;

    @Column({nullable: false})
    @Exclude()
    storage: string;

    @CreateDateColumn({type: "timestamp"})
    @Exclude()
    createDate: Date;

    @UpdateDateColumn({type: "timestamp"})
    @Exclude()
    updatedDate: Date;
}