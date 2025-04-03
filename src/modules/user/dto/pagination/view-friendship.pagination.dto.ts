import {Expose, Type} from "class-transformer";
import {ViewUserDto} from "../view/view-user.dto";

export class ViewFriendshipPaginationDto {

    @Expose()
    @Type(() => ViewUserDto)
    data: ViewUserDto[];

    @Expose()
    meta: any;

    @Expose()
    links: any;
}