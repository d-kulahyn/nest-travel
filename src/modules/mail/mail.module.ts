import {Module} from '@nestjs/common';
import {MailerModule} from "@nestjs-modules/mailer";
import {join} from "path";
import {PugAdapter} from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import {MailService} from "./mail.service";
import {MAIL_HOST, MAIL_PASS, MAIL_USER} from "../../config";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: MAIL_HOST,
                auth: {
                    user: MAIL_USER,
                    pass: MAIL_PASS
                }
            },
            defaults: {
                from: '"No Reply" <noreply@example.com>',
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new PugAdapter({inlineCssEnabled: true, inlineCssOptions: {url: ' '}})
            },
            options: {
                strict: true
            }
        }),
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {
}
