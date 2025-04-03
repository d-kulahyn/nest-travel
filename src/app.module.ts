import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './modules/user/user.module';
import {AuthModule} from './modules/auth/auth.module';
import {TypeOrmModule} from '@nestjs/typeorm';

import {DB_CONFIG} from './config';
import {EnvironmentEnum} from "./enums/environment-enum";
import {UserEntity} from "./modules/user/entities/user.entity";
import {DataSource} from "typeorm";
import {QueueModule} from './modules/queue/queue.module';
import {DbValidatorsModule} from "@youba/nestjs-dbvalidator";
import {MulterModule} from "@nestjs/platform-express";
import {MulterConfigService} from "./services/multer-config.service";
import {StorageFactory} from "./factories/storage.factory";
import {FileEntity} from "./entities/file.entity";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";
import {FileRepository} from "./repositories/file-repository";
import {HttpModule} from "@nestjs/axios";
import {UserFriendshipEntity} from "./modules/user/entities/user-friendship.entity";
import {PostEntity} from "./modules/user/entities/post.entity";
import {PostCommentEntity} from "./modules/user/entities/post-comment.entity";
import {CaslModule} from './modules/casl/casl.module';
import {PostLikeEntity} from "./modules/user/entities/post-like.entity";
import {PostFavoriteEntity} from "./modules/user/entities/post-favorite.entity";
import {UploadService} from "./services/upload-service";
import {FeedModule} from './modules/feed/feed.module';
import {PostViewEntity} from "./modules/user/entities/post-view.entity";
import {PlaceModule} from './modules/place/place.module';

@Module({
    imports:
        [
            UserModule,
            AuthModule,
            TypeOrmModule.forRoot({
                ...DB_CONFIG,
                entities: [
                    UserEntity,
                    FileEntity,
                    UserFriendshipEntity,
                    PostEntity,
                    PostCommentEntity,
                    PostLikeEntity,
                    PostFavoriteEntity,
                    PostViewEntity
                ],
                synchronize: EnvironmentEnum.DEVELOPMENT === process.env.NODE_ENV
            }),
            QueueModule,
            DbValidatorsModule.register({...DB_CONFIG}),
            MulterModule.registerAsync({
                useClass: MulterConfigService,
            }),
            ServeStaticModule.forRoot({
                rootPath: join(__dirname, 'public'),
                serveRoot: '/public'
            }),
            HttpModule,
            CaslModule,
            FeedModule,
            PlaceModule
        ],
    controllers: [AppController],
    exports: [StorageFactory, FileRepository, UploadService],
    providers: [UploadService, AppService, MulterConfigService, StorageFactory, FileRepository]
})
export class AppModule {
    constructor(private dataSource: DataSource) {
    }
}
