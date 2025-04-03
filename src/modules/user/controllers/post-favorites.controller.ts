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
import {PostFavoriteService} from "../services/post-favorite.service";
import {Action} from "../../casl/casl-ability.factory";

@Controller('v1/posts/:postId/favorites')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class PostFavoritesController {
    constructor(private readonly postFavoriteService: PostFavoriteService) {
    }

    @Post()
    async store(
        @Param('postId', ParseIntPipe) postId: number,
        @User() user: AuthUser
    ): Promise<void> {
        await this.postFavoriteService.manageFavorite(postId, user.userId);
    }

    @Delete()
    async remove(
        @Param('postId', ParseIntPipe) postId: number,
        @User() user: AuthUser
    ): Promise<void> {
        await this.postFavoriteService.manageFavorite(postId, user.userId, Action.DELETE);
    }
}