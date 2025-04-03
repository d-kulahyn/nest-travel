import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './services/auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtModule} from "@nestjs/jwt";
import {JWT_SECRET} from "../../config";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {RedisModule} from "../redis/redis.module";
import {MailModule} from "../mail/mail.module";
import {EmailConsumer} from "../queue/consumers/email-consumer";
import {QueueModule} from "../queue/queue.module";
import {AuthTokenService} from "./services/auth-token.service";
import {GoogleProvider} from "./providers/google.provider";
import {SocialiteService} from "./services/socialite.service";
import {HttpModule} from "@nestjs/axios";
import {FacebookProvider} from "./providers/facebook.provider";

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthTokenService,
        LocalStrategy,
        JwtStrategy,
        EmailConsumer,
        GoogleProvider,
        FacebookProvider,
        SocialiteService
    ],
    exports: [AuthService, AuthTokenService],
    imports: [
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET
        }),
        forwardRef(() => HttpModule),
        forwardRef(() => RedisModule),
        forwardRef(() => MailModule),
        forwardRef(() => QueueModule),
        forwardRef(() => UserModule)
    ]
})
export class AuthModule {
}
