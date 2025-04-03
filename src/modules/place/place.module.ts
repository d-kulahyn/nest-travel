import {forwardRef, Module} from '@nestjs/common';
import {PlaceService} from './place.service';
import {PlaceGateway} from './place.gateway';
import {AuthModule} from "../auth/auth.module";
import {PlaceController} from "./controllers/place.controller";
import {QueueModule} from "../queue/queue.module";
import {RedisModule} from "../redis/redis.module";
import {PlaceLogService} from "./services/place-log.service";

@Module({
    providers: [PlaceGateway, PlaceService, PlaceLogService],
    controllers: [PlaceController],
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => QueueModule),
        forwardRef(() => RedisModule),
    ]
})
export class PlaceModule {
}
