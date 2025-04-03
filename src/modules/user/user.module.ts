import {forwardRef, Module} from '@nestjs/common';
import {UserService} from './services/user.service';
import {UsersController} from './controllers/users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {MailModule} from "../mail/mail.module";
import {RedisModule} from "../redis/redis.module";
import {UserRepository} from "./repositories/user-repository";
import {QueueModule} from "../queue/queue.module";
import {AuthModule} from "../auth/auth.module";
import {FileEntity} from "../../entities/file.entity";
import {AppModule} from "../../app.module";
import {UserFriendshipsController} from "./controllers/user-friendships.controller";
import {UserFriendshipEntity} from "./entities/user-friendship.entity";
import {UserPostsController} from "./controllers/user-posts.controller";
import {UserPostRepository} from "./repositories/user-post.repository";
import {UserPostService} from "./services/user-post.service";
import {PostEntity} from "./entities/post.entity";
import {PostCommentEntity} from "./entities/post-comment.entity";
import {PostCommentsController} from "./controllers/post-comments.controller";
import {PostCommentsService} from "./services/post-comments.service";
import {PostCommentRepository} from "./repositories/post-comment.repository";
import {CaslModule} from "../casl/casl.module";
import {PostLikeEntity} from "./entities/post-like.entity";
import {PostLikeService} from "./services/post-like.service";
import {PostFavoriteEntity} from "./entities/post-favorite.entity";
import {PostFavoriteService} from "./services/post-favorite.service";
import {PostLikesController} from "./controllers/post-likes.controller";
import {PostFavoritesController} from "./controllers/post-favorites.controller";
import {ViewPostDto} from "./dto/view/view-post.dto";
import {UserLoginService} from "./services/user-login.service";
import {PostLikeRepository} from "./repositories/post-like.repository";
import {PostViewEntity} from "./entities/post-view.entity";

@Module({
    controllers: [UsersController, UserFriendshipsController, UserPostsController, PostCommentsController, PostLikesController, PostFavoritesController],
    providers: [PostViewEntity, PostLikeRepository, UserLoginService, UserRepository, UserPostRepository, PostCommentRepository, ViewPostDto, UserService, UserPostService, PostCommentsService, PostLikeService, PostFavoriteService],
    exports: [UserLoginService, UserService, UserPostService, UserRepository, UserPostRepository, TypeOrmModule, PostCommentsService],
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            FileEntity,
            UserFriendshipEntity,
            PostEntity,
            PostCommentEntity,
            PostLikeEntity,
            PostFavoriteEntity,
            PostViewEntity
        ]),
        forwardRef(() => MailModule),
        forwardRef(() => RedisModule),
        forwardRef(() => QueueModule),
        forwardRef(() => AuthModule),
        forwardRef(() => AppModule),
        forwardRef(() => CaslModule),
    ]
})
export class UserModule {
}
