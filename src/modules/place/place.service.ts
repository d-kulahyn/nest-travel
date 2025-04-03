import {Injectable} from '@nestjs/common';
import {GenerationQueueService} from "../queue/services/generation-queue.service";
import {StartStopPlaceGenerationDto} from "./dto/start-stop-place-generation.dto";

@Injectable()
export class PlaceService {

    constructor(private readonly generationQueueService: GenerationQueueService) {
    }

    async startGeneration(startStopDto: StartStopPlaceGenerationDto): Promise<void> {
        await this.generationQueueService.addGenerationJob(startStopDto);
    }

    async stopGeneration(startStopDto: StartStopPlaceGenerationDto): Promise<void> {
        await this.generationQueueService.removeGenerationJob(startStopDto);
    }
}
