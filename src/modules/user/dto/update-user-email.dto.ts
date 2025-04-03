import {PickType} from "@nestjs/mapped-types";
import {CreateUserDto} from "./create-user.dto";

export class UpdateUserEmailDto extends PickType(CreateUserDto, ['email'] as const) {
}