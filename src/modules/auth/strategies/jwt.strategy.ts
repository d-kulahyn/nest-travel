import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {JWT_SECRET} from "../../../config";
import {AuthUser} from "../types/auth-user";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET,
        });
    }

    /**
     * @param payload
     */
    async validate(payload: any): Promise<AuthUser> {
        return {userId: payload.sub}
    }
}