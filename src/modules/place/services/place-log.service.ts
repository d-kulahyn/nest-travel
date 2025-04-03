import {Injectable} from "@nestjs/common";
import {RedisService} from "../../redis/redis.service";

@Injectable()
export class PlaceLogService {

    constructor(private readonly redisService: RedisService) {

    }

    async pushLog() {

    }
}