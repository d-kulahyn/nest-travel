import {IsNotEmpty} from "class-validator";

export class StartStopPlaceGenerationDto {

    @IsNotEmpty()
    countryId: number;
}
