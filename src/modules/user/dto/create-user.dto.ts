import {IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Length, Validate} from "class-validator";
import {Match} from "../../../decorators/validation/match-decorator";
import {IsUnique} from "@youba/nestjs-dbvalidator";

export class CreateUserDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    @Validate(IsUnique, [{table: 'users', column: 'login'}])
    login: string;

    @IsEmail()
    @IsNotEmpty()
    @Validate(IsUnique, [{table: 'users', column: 'email'}])
    email: string;

    @IsOptional()
    @IsString()
    photo: string;

    @IsNotEmpty()
    @Length(6, 255)
    password: string;

    @IsNotEmpty()
    @Match('password', {message: "password confirm should be the same as password"})
    passwordConfirm: string;

    @IsString()
    @IsOptional()
    aboutMe: string;

    @IsUrl()
    @IsOptional()
    myWebsite: string;

    @IsOptional()
    social: string;
}
