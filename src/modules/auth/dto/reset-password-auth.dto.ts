import {IsEmail, IsNotEmpty, Validate} from "class-validator";
import {IsExist} from "@youba/nestjs-dbvalidator";

export class ResetPasswordAuthDto {
    @IsNotEmpty()
    @IsEmail()
    @Validate(IsExist, [{table: 'users', column: 'email'}])
    email: string;
}