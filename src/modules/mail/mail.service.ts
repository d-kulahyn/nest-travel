import {Injectable} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";
import {UserEntity} from "../user/entities/user.entity";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {
    }

    /**
     * @param user
     * @param token
     */
    async sendEmailConfirmation(user: UserEntity, token: number): Promise<void> {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Confirmation email',
            template: './email-confirmation',
            context: {
                subject: 'Confirmation mail',
                fullname: `${user.name}`,
                code: token
            }
        })
    }

    /**
     * @param user
     * @param password
     */
    async sendResetPasswordNotification(user: UserEntity, password: string): Promise<void> {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Reset password code',
            template: './reset-password',
            context: {
                subject: 'Reset password mail',
                fullname: 'your name',
                password: password
            }
        })
    }

    /**
     * @param user
     */
    async sendSuspiciousActivity(user: UserEntity): Promise<void> {
        await this.mailerService.sendMail({
            to: user.oldEmail,
            subject: 'Suspicious activity',
            template: './suspicious-activity',
            context: {
                subject: 'Suspicious activity'
            }
        })
    }
}