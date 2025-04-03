import {IsNotEmpty, Validate} from "class-validator";
import {IsExist} from "@youba/nestjs-dbvalidator";

export class CreatePostCommentDto {
    @IsNotEmpty()
    text: string;

    @Validate(IsExist, [{table: 'post_comments', column: 'id'}])
    parentId: number;
}