import {forwardRef, Module} from '@nestjs/common';
import Redis from 'ioredis';

import {REDIS_DB, REDIS_HOST, REDIS_PORT} from "../../config";
import {UserModule} from "../user/user.module";
import {REDIS_CLIENT_TOKEN, REDIS_CLIENT_TOKEN2} from "./constants";
import {RedisService} from "./redis.service";

const redisClientProvider = {
    provide: REDIS_CLIENT_TOKEN,
    useValue: new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        db: REDIS_DB
    }),
};

@Module({
    imports: [forwardRef(() => UserModule)],
    exports: [RedisService],
    providers: [
        redisClientProvider,
        RedisService
    ]
})
export class RedisModule {
}
