import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket
} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";
import {UseGuards} from "@nestjs/common";
import {User} from "../auth/decorators/user.decorator";
import {AuthUser} from "../auth/types/auth-user";
import {JwtWsGuardGuard} from "../auth/guards/jwt-ws-guard.guard";
import {PlaceLogService} from "./services/place-log.service";

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
@UseGuards(JwtWsGuardGuard)
export class PlaceGateway {

    clients: Socket[];

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly placeLogService: PlaceLogService,
    ) {
    }

    @SubscribeMessage('pushLog')
    findOne(@MessageBody() data: any, @ConnectedSocket() client: Socket, @User() user: AuthUser) {
        this.server.emit('logs', data);
    }
}
