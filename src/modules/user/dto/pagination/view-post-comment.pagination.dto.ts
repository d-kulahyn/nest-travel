import {Expose, Type} from "class-transformer";
import {ViewPostCommentDto} from "../view/view-post-comment.dto";

export class ViewPostCommentPaginationDto {

    @Expose()
    @Type(() => ViewPostCommentDto)
    data: ViewPostCommentDto[];

    @Expose()
    meta: any;

    @Expose()
    links: any;
}