// ticket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Sprint, Ticket } from '@prisma/client';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Ajusta el origen según tus necesidades
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    // console.log('EventsGateway initialized');
  }

  handleConnection(client: Socket) {
    // console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected:', client.id);
  }

  // Método para emitir actualizaciones de tickets a todos los clientes conectados
  emitTicketUpdate(data: Ticket) {
    this.server.emit('ticketUpdated', data);
  }
  emitTicketCreate(data: Ticket) {
    this.server.emit('ticketCreated', data);
  }
  emitTicketDelete(data: Ticket) {
    this.server.emit('ticketDeleted', data);
  }

  emitSprintUpdate(data: Sprint) {
    this.server.emit('sprintUpdate', data);
  }

  emitSprintCreate(data: Sprint) {
    this.server.emit('sprintCreated', data);
  }

  emitSprintDelete(data: Sprint) {
    this.server.emit('sprintDeleted', data);
  }
}
