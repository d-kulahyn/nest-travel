import {Expose, Type} from "class-transformer";
import {FileViewDto} from "../../../../dtos/file-view.dto";

export class ViewUserInfoDto {

    @Type(() => FileViewDto)
    @Expose()
    avatar: FileViewDto;

    @Expose()
    login: string;

    @Expose()
    name: string | null;

    @Expose()
    countOfPosts: number;

    @Expose()
    isFollowed: boolean;

    @Expose()
    countOfFollowers: number;

    @Expose()
    countOfFollowings: number
}