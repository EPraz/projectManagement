import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRetroCardDto, UpdateRetroCardDto } from 'src/dto';
import { RetroCard } from '@prisma/client';
import { EventsGateway } from 'src/webSockets/events.gateway';
export declare class RetrospectiveService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    create(createDto: CreateRetroCardDto): Promise<RetroCard>;
    findAll(sprintId?: string): Promise<RetroCard[]>;
    findOne(id: string): Promise<RetroCard>;
    update(id: string, updateDto: UpdateRetroCardDto): Promise<RetroCard>;
    delete(id: string): Promise<boolean>;
}
