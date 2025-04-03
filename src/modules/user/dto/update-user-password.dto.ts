import {PickType} from "@nestjs/mapped-types";
import {CreateUserDto} from "./create-user.dto";
import {IsNotEmpty} from "class-validator";

export class UpdateUserPasswordDto extends PickType(CreateUserDto, ['password'] as const) {
    @IsNotEmpty()
    newPassword: string;
}