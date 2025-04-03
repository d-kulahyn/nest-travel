import {Processor} from "@nestjs/bull";
import {Injectable} from "@nestjs/common";
import {GENERATION_QUEUE_NAME} from "../constants/queue-name.constants";
import {Process} from "@nestjs/bull";
import {START_GENERATION_JOB_NAME} from "../constants/job-name.constants";
import {Job} from "bull";

@Processor(GENERATION_QUEUE_NAME)
@Injectable()
export class GenerationConsumer {

    @Process(START_GENERATION_JOB_NAME)
    async startGeneration(job: Job<{ countryId: number }>) {
        console.log(123);
    }
}