import {
    Body,
    ClassSerializerInterceptor,
    Controller, Get,
    HttpCode,
    HttpStatus, Param,
    ParseFilePipeBuilder, ParseIntPipe,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {UpdateUserDto} from '../dto/update-user.dto';
import {User} from "../../auth/decorators/user.decorator";
import {AuthUser} from "../../auth/types/auth-user";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {UpdateUserEmailDto} from "../dto/update-user-email.dto";
import {UpdateUserPasswordDto} from "../dto/update-user-password.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {MAX_FILE_SIZE} from "../../../config/storages";
import {fileFilter} from "../../../utils/storage";
import {plainToInstance} from "class-transformer";
import {FileViewDto} from "../../../dtos/file-view.dto";
import {ViewUserInfoDto} from "../dto/view/view-user-info.dto";
import {Paginate, PaginateQuery} from "nestjs-paginate";
import {ViewFriendshipPaginationDto} from "../dto/pagination/view-friendship.pagination.dto";
import {FriendshipTypeEnum} from "../enums/friendship-type.enum";

@Controller('v1/profile')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private readonly userService: UserService
    ) {
    }

    @Get(':userId')
    @HttpCode(HttpStatus.OK)
    async show(@Param('userId', ParseIntPipe) userId: number, @User() user: AuthUser) {
        return plainToInstance(ViewUserInfoDto, await this.userService.getUserInfo(userId, user.userId), {
            excludeExtraneousValues: true
        });
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    async update(@Body() updateUserDto: UpdateUserDto, @User() user: AuthUser) {
        await this.userService.updateProfile(updateUserDto, user.userId)
    }

    @Put('email')
    @HttpCode(HttpStatus.OK)
    async updateEmail(@Body() updateUserEmailDto: UpdateUserEmailDto, @User() user: AuthUser) {
        await this.userService.updateUserEmail(updateUserEmailDto, user.userId);
    }

    @Put('password')
    @HttpCode(HttpStatus.OK)
    async updatePassword(@Body() updateUserPasswordDto: UpdateUserPasswordDto, @User() user: AuthUser) {
        await this.userService.updateUserPassword(updateUserPasswordDto, user.userId);
    }

    @Get(':userId/followings')
    async followings(@Param('userId', ParseIntPipe) userId: number, @Paginate() query: PaginateQuery) {
        return plainToInstance(
            ViewFriendshipPaginationDto, await this.userService.paginate(userId, query, FriendshipTypeEnum.FOLLOWINGS),
            {excludeExtraneousValues: true}
        );
    }

    @Get(':userId/followers')
    async followers(@Param('userId', ParseIntPipe) userId: number, @Paginate() query: PaginateQuery) {
        return plainToInstance(
            ViewFriendshipPaginationDto, await this.userService.paginate(userId, query, FriendshipTypeEnum.FOLLOWERS),
            {excludeExtraneousValues: true}
        );
    }

    @Put('avatar')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('avatar', {
        fileFilter: fileFilter(['jpeg', 'jpg', 'png'])
    }))
    async avatar(@UploadedFile(
        new ParseFilePipeBuilder()
            .addMaxSizeValidator({maxSize: MAX_FILE_SIZE})
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })
    ) avatar: Express.Multer.File, @User() user: AuthUser): Promise<FileViewDto> {
        return plainToInstance(FileViewDto, await this.userService.updateAvatar(avatar, user.userId), {
            excludeExtraneousValues: true
        });
    }
}
