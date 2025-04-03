import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Socket} from "socket.io";
import {AuthService} from "../services/auth.service";

@Injectable()
export class JwtWsGuardGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {
    }

    /**
     * @param context
     */
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const wsClient = context.switchToWs().getClient<Socket>();
        const request = context.switchToHttp().getRequest();
        try {
            const {userId} = this.authService.wsAuth(wsClient);
            request.user = {userId};
        } catch (e) {
            wsClient.disconnect(true);

            return false;
        }

        return true;
    }
}
