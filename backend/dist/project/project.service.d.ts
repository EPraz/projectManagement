import { Project, User } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/webSockets/events.gateway';
export declare class ProjectService {
    private readonly prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    create(request: CreateProjectDto): Promise<Project | null>;
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    update(request: UpdateProjectDto): Promise<Project>;
    remove(id: string): Promise<boolean>;
    assignUserToProject(projectId: string, userId: string): Promise<User[]>;
    removeUserFromProject(projectId: string, userId: string): Promise<User[]>;
}
