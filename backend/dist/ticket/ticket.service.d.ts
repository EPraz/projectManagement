import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, GetAllTicketsDto, UpdateTicketDto } from 'src/dto';
import { Ticket } from '@prisma/client';
import { EventsGateway } from 'src/webSockets/events.gateway';
export declare class TicketService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    create(request: CreateTicketDto): Promise<Ticket | null>;
    findAllTickets(request: GetAllTicketsDto): Promise<Ticket[]>;
    findOne(id: number): Promise<Ticket | null>;
    update(request: UpdateTicketDto): Promise<Ticket | null>;
    bulkUpdate(request: UpdateTicketDto[]): Promise<Ticket[]>;
    deleteAll(): Promise<void>;
    delete(id: number): Promise<boolean>;
}
