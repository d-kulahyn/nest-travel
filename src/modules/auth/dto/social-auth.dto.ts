import {IsNotEmpty} from "class-validator";

export class SocialAuthDto {
    @IsNotEmpty()
    accessToken: string;
}