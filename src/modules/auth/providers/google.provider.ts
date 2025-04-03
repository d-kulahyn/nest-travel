import {AbstractSocialProvider} from "./abstract-social.provider";
import {GoogleSocialInterface, SocialUserInterface} from "../interfaces/social-user.interface";
import {firstValueFrom, map} from "rxjs";
import {BadRequestException, Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class GoogleProvider extends AbstractSocialProvider {

    /**
     * @param httpService
     */
    constructor(private readonly httpService: HttpService) {
        super();
    }

    /**
     * @param token
     */
    async getUserByToken(token: string): Promise<SocialUserInterface> {
        try {
            const response = await firstValueFrom<GoogleSocialInterface>(this.httpService.get<GoogleSocialInterface>(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                    params: {
                        prettyPrint: false
                    },
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            )
                .pipe(map(res => res.data)));
            return {
                id: response.sub,
                email: response?.email ?? null,
                avatar: null
            };
        } catch (e) {
            throw new BadRequestException('Invalid token');
        }
    }
}