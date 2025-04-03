import {IsNotEmpty} from "class-validator";

export class LoginAuthDto {
    @IsNotEmpty()
    login: string

    @IsNotEmpty()
    password: string
}