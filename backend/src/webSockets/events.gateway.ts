import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Project, Sprint, Ticket } from '@prisma/client';
import { Server } from 'socket.io';
import { omitCredentials } from '../public-data.interceptor';

@WebSocketGateway({
  cors: {
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allowed: boolean) => void,
    ) => callback(null, origin === process.env.CLIENT_URL),
  },
  allowRequest: (
    req: import('http').IncomingMessage,
    callback: (error: string | null, allowed: boolean) => void,
  ) => callback(null, req.headers.origin === process.env.CLIENT_URL),
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // Método para emitir actualizaciones de tickets a todos los clientes conectados
  // Events for Tickets
  emitTicketUpdate(data: Ticket) {
    this.server.emit('ticketUpdated', omitCredentials(data));
  }
  emitTicketCreate(data: Ticket) {
    this.server.emit('ticketCreated', omitCredentials(data));
  }
  emitTicketDelete(data: Ticket) {
    this.server.emit('ticketDeleted', omitCredentials(data));
  }

  // Events for Sprints
  emitSprintUpdate(data: Sprint) {
    this.server.emit('sprintUpdated', omitCredentials(data));
  }

  emitSprintCreate(data: Sprint) {
    this.server.emit('sprintCreated', omitCredentials(data));
  }

  emitSprintDelete(data: Sprint) {
    this.server.emit('sprintDeleted', omitCredentials(data));
  }

  // Events for Projects
  emitProjectUpdate(data: Project) {
    this.server.emit('projectUpdated', omitCredentials(data));
  }

  emitProjectDelete(data: Project) {
    this.server.emit('projectDeleted', omitCredentials(data));
  }
}
