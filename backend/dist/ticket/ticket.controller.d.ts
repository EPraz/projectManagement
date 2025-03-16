import { Ticket } from '@prisma/client';
import { CreateTicketDto, UpdateTicketDto } from 'src/dto';
import { TicketService } from './ticket.service';
export declare class TicketController {
    private readonly ticketService;
    constructor(ticketService: TicketService);
    create(newTicket: CreateTicketDto): Promise<Ticket | null>;
    findAll(featureId?: string, sprintId?: string, ticketStatusId?: string): Promise<Ticket[]>;
    findOne(id: number): Promise<Ticket | null>;
    bulkUpdate(request: UpdateTicketDto[]): Promise<Ticket[]>;
    update(id: number, request: UpdateTicketDto): Promise<Ticket | null>;
    deleteAll(): Promise<void>;
    delete(id: number): Promise<boolean>;
}
