import {InjectQueue} from "@nestjs/bull";
import {EMAIL_QUEUE_NAME} from "../constants/queue-name.constants";
import {Queue} from "bull";
import {Injectable} from "@nestjs/common";
import {UserEntity} from "../../user/entities/user.entity";
import {
    CONFIRM_EMAIL_JOB_NAME,
    RESET_PASSWORD_JOB_NAME,
    SUSPICIOUS_ACTIVITY_JOB_NAME
} from "../constants/job-name.constants";

@Injectable()
export class EmailQueueService {
    constructor(
        @InjectQueue(EMAIL_QUEUE_NAME) private readonly emailsQueue: Queue
    ) {
    }

    /**
     * @param user
     * @param password
     */
    async addResetPasswordJob(user: UserEntity, password: string) {
        await this.emailsQueue.add(RESET_PASSWORD_JOB_NAME, {user, password})
    }

    /**
     * @param user
     * @param token
     */
    async addConfirmEmailJob(user: Partial<UserEntity>, token: string) {
        await this.emailsQueue.add(CONFIRM_EMAIL_JOB_NAME, {user, token})
    }

    /**
     * @param user
     */
    async addSuspiciousEmailJob(user: Partial<UserEntity>) {
        await this.emailsQueue.add(SUSPICIOUS_ACTIVITY_JOB_NAME, {user})
    }
}