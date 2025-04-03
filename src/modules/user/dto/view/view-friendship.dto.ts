import {Expose, Type} from "class-transformer";
import {ViewUserDto} from "./view-user.dto";

export class ViewFriendshipDto {
    @Expose()
    @Type(() => ViewUserDto)
    user: ViewUserDto;
}