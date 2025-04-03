import {
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {User} from "../../auth/decorators/user.decorator";
import {AuthUser} from "../../auth/types/auth-user";
import {PostLikeService} from "../services/post-like.service";
import {Action} from "../../casl/casl-ability.factory";

@Controller('v1/posts/:postId/likes')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class PostLikesController {
    constructor(private readonly postLikeService: PostLikeService) {
    }

    @Post()
    async store(
        @Param('postId', ParseIntPipe) postId: number,
        @User() user: AuthUser
    ): Promise<void> {
        await this.postLikeService.manageLike(postId, user.userId);
    }

    @Delete()
    async remove(
        @Param('postId', ParseIntPipe) postId: number,
        @User() user: AuthUser
    ): Promise<void> {
        await this.postLikeService.manageLike(postId, user.userId, Action.DELETE);
    }
}