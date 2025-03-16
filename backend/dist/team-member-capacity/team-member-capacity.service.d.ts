import { TeamMemberCapacity } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamMemberCapacityDto, UpdateTeamMemberCapacityDto } from 'src/dto';
import { EventsGateway } from 'src/webSockets/events.gateway';
export declare class TeamMemberCapacityService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    create(createDto: CreateTeamMemberCapacityDto): Promise<TeamMemberCapacity>;
    findAllBySprint(sprintId: string): Promise<TeamMemberCapacity[]>;
    findOne(id: string): Promise<TeamMemberCapacity>;
    update(id: string, updateDto: UpdateTeamMemberCapacityDto): Promise<TeamMemberCapacity>;
    delete(id: string): Promise<boolean>;
}
