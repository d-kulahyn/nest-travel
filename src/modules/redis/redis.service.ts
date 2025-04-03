import {Inject, Injectable, OnModuleInit} from "@nestjs/common";
import {REDIS_CLIENT_TOKEN} from "../../config";
import Redis from "ioredis";
import {CONFIRM_EMAIL, RESET_PASSWORD} from "./redis-keys";
import {SECONDS_IN_HOUR} from "../../utils/math";

@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENT_TOKEN) private readonly redisClient: Redis) {
    }

    async onApplicationBootstrap() {
        this.redisClient.psubscribe('*', () => {
        });

        this.redisClient.on('pmessage', (subscribed, channel, message) => {
            console.log("pmessage: " + message);
        });
    }

    /**
     * @param email
     * @param token
     */
    async setTmpPasswordResetToken(email: string, token: number): Promise<void> {
        this.redisClient.set(`${RESET_PASSWORD}:${email}`, token, 'EX', SECONDS_IN_HOUR)
    }

    /**
     * @param email
     * @param token
     */
    async setConfirmEmailToken(email: string, token: number) {
        this.redisClient.set(`${CONFIRM_EMAIL}:${email}`, token, 'EX', SECONDS_IN_HOUR)
    }

    /**
     * @param email
     */
    async getConfirmEmailToken(email: string): Promise<string | null> {
        return this.redisClient.getdel(`${CONFIRM_EMAIL}:${email}`);
    }

    /**
     * @param email
     */
    async getResetPasswordToken(email: string): Promise<string | null> {
        return this.redisClient.getdel(`${RESET_PASSWORD}:${email}`);
    }
}