import {Injectable} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bull";
import {GENERATION_QUEUE_NAME} from "../constants/queue-name.constants";
import {Queue} from "bull";
import {START_GENERATION_JOB_NAME} from "../constants/job-name.constants";
import {StartStopPlaceGenerationDto} from "../../place/dto/start-stop-place-generation.dto";

@Injectable()
export class GenerationQueueService {
    constructor(@InjectQueue(GENERATION_QUEUE_NAME) private readonly generationQueue: Queue) {
    }

    /**
     * @param startStopDto
     */
    async addGenerationJob(startStopDto: StartStopPlaceGenerationDto): Promise<void> {
        await this.generationQueue.add(START_GENERATION_JOB_NAME, {countryId: startStopDto.countryId}, {
            jobId: `country:${startStopDto.countryId}`
        })
    }

    async removeGenerationJob(startStopDto: StartStopPlaceGenerationDto): Promise<void> {
        await this.generationQueue.removeJobs(`country:${startStopDto.countryId}`);
    }
}