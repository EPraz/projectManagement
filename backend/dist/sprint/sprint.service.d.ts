import { Sprint } from '@prisma/client';
import { CreateSprintDto, UpdateSprintDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/webSockets/events.gateway';
export declare class SprintService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    create(request: CreateSprintDto): Promise<Sprint>;
    getSprintsByProject(projectId: string): Promise<Sprint[]>;
    findOne(id: string): Promise<Sprint>;
    update(request: UpdateSprintDto): Promise<Sprint>;
    delete(id: string): Promise<boolean>;
}
