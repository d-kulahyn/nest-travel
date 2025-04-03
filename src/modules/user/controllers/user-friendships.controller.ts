import {Body, ClassSerializerInterceptor, Controller, Delete, Post, UseGuards, UseInterceptors} from "@nestjs/common";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {UserFriendshipDto} from "../dto/user-friendship.dto";
import {UserService} from "../services/user.service";
import {User} from "../../auth/decorators/user.decorator";
import {AuthUser} from "../../auth/types/auth-user";
import {FriendshipActionEnum} from "../enums/friendship-action.enum";

@Controller('v1/user/followings')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class UserFriendshipsController {
    constructor(private readonly userService: UserService) {
    }

    @Post()
    async store(@Body() friendshipDto: UserFriendshipDto, @User() user: AuthUser): Promise<void> {
        await this.userService.doFriendship(
            user.userId,
            friendshipDto,
            FriendshipActionEnum.ADD
        );
    }

    @Delete()
    async remove(@Body() friendshipDto: UserFriendshipDto, @User() user: AuthUser): Promise<void> {
        await this.userService.doFriendship(
            user.userId,
            friendshipDto,
            FriendshipActionEnum.REMOVE
        );
    }
}