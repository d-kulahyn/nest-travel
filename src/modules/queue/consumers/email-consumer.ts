import {Process, Processor} from "@nestjs/bull";
import {Job} from 'bull';
import {Injectable} from "@nestjs/common";
import {MailService} from "../../mail/mail.service";
import {UserEntity} from "../../user/entities/user.entity";
import {EMAIL_QUEUE_NAME} from "../constants/queue-name.constants";
import {SUSPICIOUS_ACTIVITY_JOB_NAME} from "../constants/job-name.constants";

@Processor(EMAIL_QUEUE_NAME)
@Injectable()
export class EmailConsumer {
    constructor(private readonly mailService: MailService) {
    }

    @Process('reset_password')
    async sendResetPassword(job: Job<{ user: UserEntity, password: string }>) {
        await this.mailService.sendResetPasswordNotification(job.data.user, job.data.password);
    }

    @Process('confirm_email')
    async sendConfirmEmail(job: Job<{ user: UserEntity, token: number }>) {
        await this.mailService.sendEmailConfirmation(job.data.user, job.data.token);
    }

    @Process(SUSPICIOUS_ACTIVITY_JOB_NAME)
    async sendSuspiciousActivity(job: Job<{ user: UserEntity }>) {
        await this.mailService.sendSuspiciousActivity(job.data.user);
    }
}