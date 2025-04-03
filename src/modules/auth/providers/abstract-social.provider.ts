import {SocialUserInterface} from "../interfaces/social-user.interface";

export abstract class AbstractSocialProvider {

    /**
     * @param token
     */
    abstract getUserByToken(token: string): Promise<SocialUserInterface>;
}

