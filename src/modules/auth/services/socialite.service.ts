import {SocialiteEnum} from "../enums/socialite.enum";
import {GoogleProvider} from "../providers/google.provider";
import {ModuleRef} from "@nestjs/core";
import {BadRequestException, Injectable} from "@nestjs/common";
import {AbstractSocialProvider} from "../providers/abstract-social.provider";
import {FacebookProvider} from "../providers/facebook.provider";

@Injectable()
export class SocialiteService {

    /**
     * @param moduleRef
     */
    constructor(private readonly moduleRef: ModuleRef) {
    }

    /**
     * @param driver
     */
    async driver(driver: SocialiteEnum): Promise<AbstractSocialProvider> {
        if (driver === SocialiteEnum.GOOGLE) {
            return await this.moduleRef.create<GoogleProvider>(GoogleProvider);
        } else if (driver === SocialiteEnum.FACEBOOK) {
            return await this.moduleRef.create<FacebookProvider>(FacebookProvider);
        }

        throw new BadRequestException(`Unknown social driver ${driver}`);
    }
}