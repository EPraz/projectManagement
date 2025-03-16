import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto } from 'src/dto';
import { EventsGateway } from 'src/webSockets/events.gateway';
export declare class TaskService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    create(request: CreateTaskDto): Promise<Task>;
    findAllByTicket(ticketId: number): Promise<Task[]>;
    findOne(id: number): Promise<Task>;
    update(request: UpdateTaskDto): Promise<Task>;
    delete(id: number): Promise<boolean>;
}
