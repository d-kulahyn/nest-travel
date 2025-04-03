import {Module} from '@nestjs/common';
import {BullModule} from "@nestjs/bull";
import {REDIS_DB_QUEUE, REDIS_HOST, REDIS_PORT} from "../../config";
import {EmailQueueService} from "./services/email-queue.service";
import {EMAIL_QUEUE_NAME, GENERATION_QUEUE_NAME} from "./constants/queue-name.constants";
import {GenerationQueueService} from "./services/generation-queue.service";
import {GenerationConsumer} from "./consumers/generation-consumer";

@Module({
    providers: [EmailQueueService, GenerationQueueService, GenerationConsumer],
    exports: [EmailQueueService, GenerationQueueService],
    imports: [
        BullModule.forRoot({
            redis: {
                host: REDIS_HOST,
                port: REDIS_PORT,
                db: REDIS_DB_QUEUE
            }
        }),
        BullModule.registerQueue({name: EMAIL_QUEUE_NAME}),
        BullModule.registerQueue({name: GENERATION_QUEUE_NAME})
    ]
})
export class QueueModule {
}
