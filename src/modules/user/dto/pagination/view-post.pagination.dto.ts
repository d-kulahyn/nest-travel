import {Expose, Type} from "class-transformer";
import {ViewPostDto} from "../view/view-post.dto";

export class ViewPostPaginationDto {

    @Expose()
    @Type(() => ViewPostDto)
    data: ViewPostDto[];

    @Expose()
    meta: any;

    @Expose()
    links: any;
}