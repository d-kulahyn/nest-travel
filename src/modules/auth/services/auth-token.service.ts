import {Injectable} from "@nestjs/common";
import {getRandom} from "../../../utils/math";

@Injectable()
export class AuthTokenService {

    /**
     * @return number
     */
    getConfirmationToken(): number {
        return getRandom(111111, 999999, 0);
    }
}