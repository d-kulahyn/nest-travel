import {forwardRef, Module} from '@nestjs/common';
import {UserModule} from "../user/user.module";
import {FeedController} from "./feed.controller";

@Module({
    controllers: [FeedController],
    imports: [
        forwardRef(() => UserModule),
    ]
})
export class FeedModule {
}
