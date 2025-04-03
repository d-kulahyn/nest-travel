import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {PlaceService} from "../place.service";
import {StartStopPlaceGenerationDto} from "../dto/start-stop-place-generation.dto";

@Controller('generation')
@UseGuards(JwtAuthGuard)
export class PlaceController {

    constructor(private readonly placeService: PlaceService) {
    }

    @Post('start')
    @HttpCode(HttpStatus.OK)
    async start(@Body() startStopDto: StartStopPlaceGenerationDto): Promise<void> {
        await this.placeService.startGeneration(startStopDto);
    }

    @Post('stop')
    @HttpCode(HttpStatus.OK)
    async stop(@Body() startStopDto: StartStopPlaceGenerationDto): Promise<void> {
        await this.placeService.stopGeneration(startStopDto);
    }
}