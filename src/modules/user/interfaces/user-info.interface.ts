import {FileEntity} from "../../../entities/file.entity";

export interface UserInfoInterface {
    avatar: FileEntity | null,
    login: string,
    name: string | null,
    countOfPosts: number,
    isFollowed: boolean,
    countOfFollowers: number,
    countOfFollowings: number
}