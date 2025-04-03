import {IsNotEmpty, Validate} from "class-validator";
import {IsExist} from "@youba/nestjs-dbvalidator";

export class UserFriendshipDto {
    @IsNotEmpty()
    @Validate(IsExist, [{table: 'users', column: 'id'}])
    userId: number;
}