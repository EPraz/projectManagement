import { ConfigService } from '@nestjs/config';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Project, Sprint, Ticket } from '@prisma/client';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true, // 🔁 Refleja dinámicamente el Origin en el header
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly configService: ConfigService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    const allowedOrigin = this.configService.get<string>('CLIENT_URL');
    (server.engine as any).allowRequest = (
      req: import('http').IncomingMessage,
      callback: (err: string | null, success: boolean) => void,
    ) => {
      const requestOrigin = req.headers.origin;
      const isAllowed = requestOrigin === allowedOrigin;

      if (!isAllowed) {
        console.warn(`Blocked socket connection from origin: ${requestOrigin}`);
      }

      callback(null, isAllowed);
    };
  }

  handleConnection(client: Socket) {
    // console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected:', client.id);
  }

  // Método para emitir actualizaciones de tickets a todos los clientes conectados
  // Events for Tickets
  emitTicketUpdate(data: Ticket) {
    this.server.emit('ticketUpdated', data);
  }
  emitTicketCreate(data: Ticket) {
    this.server.emit('ticketCreated', data);
  }
  emitTicketDelete(data: Ticket) {
    this.server.emit('ticketDeleted', data);
  }

  // Events for Sprints
  emitSprintUpdate(data: Sprint) {
    this.server.emit('sprintUpdated', data);
  }

  emitSprintCreate(data: Sprint) {
    this.server.emit('sprintCreated', data);
  }

  emitSprintDelete(data: Sprint) {
    this.server.emit('sprintDeleted', data);
  }

  // Events for Projects
  emitProjectUpdate(data: Project) {
    this.server.emit('projectUpdated', data);
  }
}
