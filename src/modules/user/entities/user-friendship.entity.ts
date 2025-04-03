import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity({name: 'user_friendships', synchronize: false})
export class UserFriendshipEntity {
    @Column()
    @PrimaryColumn()
    followerId: number;

    @Column()
    @PrimaryColumn()
    userId: number;
}