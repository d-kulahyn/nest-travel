import {Injectable} from "@nestjs/common";
import {UserRepository} from "../repositories/user-repository";
import {getRandom} from "../../../utils/math";
import {APP_USER_PREFIX} from "../../../config";

@Injectable()
export class UserLoginService {

    constructor(private readonly userRepository: UserRepository) {
    }

    async getInternalUserLogin(): Promise<string> {
        const user: { id: number } | null = await this.userRepository.getLastUser();
        const randomIdentifier = getRandom(11111, 99999, 0);

        return user === null
            ? `${APP_USER_PREFIX}_${randomIdentifier}`
            : `${APP_USER_PREFIX}_${randomIdentifier}${user.id + 1}`;
    }
}