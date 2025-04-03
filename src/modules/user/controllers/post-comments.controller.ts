import {
    Body,
    ClassSerializerInterceptor,
    Controller, Delete,
    Get,
    HttpCode,
    HttpStatus, Param, ParseIntPipe, Post, Put,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CreatePostCommentDto} from "../dto/create-post-comment.dto";
import {PostCommentsService} from "../services/post-comments.service";
import {User} from "../../auth/decorators/user.decorator";
import {AuthUser} from "../../auth/types/auth-user";
import {UpdatePostCommentDto} from "../dto/update-post-comment.dto";
import {Paginate, PaginateQuery} from "nestjs-paginate";
import {plainToInstance} from "class-transformer";
import {ViewPostCommentDto} from "../dto/view/view-post-comment.dto";
import {ViewPostCommentPaginationDto} from "../dto/pagination/view-post-comment.pagination.dto";

@Controller('v1/posts/:postId/comments')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class PostCommentsController {

    constructor(private readonly postCommentService: PostCommentsService) {
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async index(@Paginate() query: PaginateQuery, @Param('postId', ParseIntPipe) postId: number): Promise<ViewPostCommentPaginationDto> {
        return plainToInstance(
            ViewPostCommentPaginationDto, await this.postCommentService.paginate(postId, query),
            {excludeExtraneousValues: true}
        );
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async store(@User() user: AuthUser, @Body() createPostCommentDto: CreatePostCommentDto, @Param('postId', ParseIntPipe) postId: number): Promise<ViewPostCommentDto> {
        return plainToInstance(
            ViewPostCommentDto, await this.postCommentService.createComment(postId, user.userId, createPostCommentDto),
            {excludeExtraneousValues: true}
        );
    }


    @Delete(':commentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param('commentId', ParseIntPipe) commentId: number,
        @Param('postId', ParseIntPipe) postId: number,
        @User() user: AuthUser
    ): Promise<void> {
        await this.postCommentService.manageComment(user.userId, postId, commentId)
    }

    @Get(':commentId/replies')
    async replies(
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Paginate() query: PaginateQuery
    ) {
        return plainToInstance(ViewPostCommentDto, await this.postCommentService.paginate(postId, query, commentId))
    }


    @Put(':commentId')
    @HttpCode(HttpStatus.OK)
    async update(
        @Body() updatePostCommentDto: UpdatePostCommentDto,
        @User() user: AuthUser,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Param('postId', ParseIntPipe) postId: number
    ) {
        await this.postCommentService.manageComment(user.userId, postId, commentId, updatePostCommentDto);
    }
}