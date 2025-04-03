import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {User} from "../../auth/decorators/user.decorator";
import {AuthUser} from "../../auth/types/auth-user";
import {CreatePostDto} from "../dto/create-post.dto";
import {UserPostService} from "../services/user-post.service";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {plainToInstance} from "class-transformer";
import {ViewPostPaginationDto} from "../dto/pagination/view-post.pagination.dto";
import {UpdatePostDto} from "../dto/update-post.dto";
import {Paginate, PaginateQuery} from "nestjs-paginate";
import {ViewPostDto} from "../dto/view/view-post.dto";

@Controller('v1/users/:userId/posts')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class UserPostsController {

    constructor(
        private readonly userPostService: UserPostService
    ) {
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async index(
        @Paginate() query: PaginateQuery,
        @Param('userId', ParseIntPipe) userId: number,
        @User() user: AuthUser
    ) {
        return plainToInstance(
            ViewPostPaginationDto, await this.userPostService.paginate(user.userId, userId, query),
            {excludeExtraneousValues: true}
        );
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async store(@Body() createPostDto: CreatePostDto, @User() user: AuthUser, @Param('userId', ParseIntPipe) userId: number) {
        return plainToInstance(ViewPostDto, await this.userPostService.createPost(userId, user.userId, createPostDto), {
            excludeExtraneousValues: true
        });
    }

    @Delete(':postId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('postId', ParseIntPipe) postId: number, @User() user: AuthUser): Promise<void> {
        await this.userPostService.managePost(user.userId, postId)
    }

    @Put(':postId')
    @HttpCode(HttpStatus.OK)
    async update(@Body() updatePostDto: UpdatePostDto, @User() user: AuthUser, @Param('postId', ParseIntPipe) postId: number) {
        await this.userPostService.managePost(user.userId, postId, updatePostDto);
    }

}