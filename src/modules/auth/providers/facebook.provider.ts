import {AbstractSocialProvider} from "./abstract-social.provider";
import {FacebookSocialInterface, SocialUserInterface} from "../interfaces/social-user.interface";
import {firstValueFrom, map} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {BadRequestException, Injectable} from "@nestjs/common";

@Injectable()
export class FacebookProvider extends AbstractSocialProvider {

    private fields: string[] = ['name', 'email', 'gender', 'verified', 'link'];

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
            const response = await firstValueFrom<FacebookSocialInterface>(this.httpService.get<FacebookSocialInterface>(
                'https://graph.facebook.com/v3.3/me',
                {
                    params: {
                        access_token: token,
                        fields: this.fields.join(',')
                    },
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            )
                .pipe(map(res => res.data)));

            return {
                id: response.id,
                email: response?.email ?? null,
                avatar: response?.avatar ?? null
            }
        } catch (e) {
            throw new BadRequestException('Invalid token.')
        }
    }

}