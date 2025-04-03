import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'generation'})
export class UserFriendshipEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cityId: number;

    @Column()
    indexI: number;

    @Column()
    indexJ: number;

    @Column()
    type: string;

    @Column()
    isGenerated: boolean
}