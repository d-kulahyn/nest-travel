import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthService} from "../services/auth.service";
import {UserEntity} from "../../user/entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authService: AuthService) {
        super({usernameField: 'login'});
    }

    /**
     * @param username
     * @param password
     */
    async validate(username: string, password: string): Promise<UserEntity> {
        const user: UserEntity | null = await this.authService.validateUser(username, password);
        if (!user) throw new UnauthorizedException('Invalid login or password');

        return user;
    }
}