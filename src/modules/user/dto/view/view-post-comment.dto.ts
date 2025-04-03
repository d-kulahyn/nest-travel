import {Expose, Type} from "class-transformer";
import {ViewUserDto} from "./view-user.dto";
import {PostCommentEntity} from "../../entities/post-comment.entity";

export class ViewPostCommentDto {
    @Expose()
    id: number;

    @Expose()
    text: string;

    @Expose()
    @Type(() => ViewUserDto)
    user: ViewUserDto;

    @Expose()
    @Type(() => ViewPostCommentDto)
    parent?: ViewPostCommentDto;

    @Expose()
    @Type(() => ViewPostCommentDto)
    replies?: ViewPostCommentDto[]
}