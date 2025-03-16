import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Project, Sprint, Ticket } from '@prisma/client';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    emitTicketUpdate(data: Ticket): void;
    emitTicketCreate(data: Ticket): void;
    emitTicketDelete(data: Ticket): void;
    emitSprintUpdate(data: Sprint): void;
    emitSprintCreate(data: Sprint): void;
    emitSprintDelete(data: Sprint): void;
    emitProjectUpdate(data: Project): void;
}
