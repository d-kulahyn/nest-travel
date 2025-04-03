import {Expose, Transform, TransformFnParams, Type} from "class-transformer";
import {FileViewDto} from "../../../../dtos/file-view.dto";
import {ViewUserDto} from "./view-user.dto";
import {ViewPostCommentDto} from "./view-post-comment.dto";
import {Injectable} from "@nestjs/common";

@Injectable()
export class ViewPostDto {

    @Expose()
    id: number;

    @Expose()
    test: number;

    @Expose()
    description: string;

    @Expose()
    place: string;

    @Expose()
    countOfComments: number;

    @Expose()
    countOfLikes: number;

    @Expose()
    isLiked: number;

    @Expose()
    isInFavorites: boolean;

    @Expose()
    @Type(() => ViewUserDto)
    user: ViewUserDto;

    @Expose()
    @Type(() => ViewPostCommentDto)
    comments: ViewPostCommentDto[];

    @Expose()
    @Type(() => ViewUserDto)
    likes: ViewUserDto[];

    @Expose()
    @Type(() => FileViewDto)
    files: FileViewDto[];
}