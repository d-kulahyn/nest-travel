import {IsArray, IsNotEmpty, IsOptional, Validate} from "class-validator";
import {IsExist} from "@youba/nestjs-dbvalidator";

export class CreatePostDto {
    @IsNotEmpty()
    description: string;

    @IsOptional()
    place: string;

    @IsNotEmpty()
    @IsArray()
    @Validate(IsExist, [{table: 'files', column: 'id'}], {each: true})
    filesIds: number[];

    userId: number;
}