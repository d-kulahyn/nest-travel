import {PartialType, PickType} from '@nestjs/mapped-types';
import {CreateUserDto} from './create-user.dto';
import {IsNotEmpty, IsString} from "class-validator";

export class UpdateUserDto extends PartialType(
    PickType(CreateUserDto, ['name', 'photo', 'login', 'aboutMe', 'myWebsite'] as const)
) {

    @IsString()
    @IsNotEmpty()
    login: string;
}
