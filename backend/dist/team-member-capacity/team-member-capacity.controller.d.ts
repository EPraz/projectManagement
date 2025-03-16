import { TeamMemberCapacityService } from './team-member-capacity.service';
import { TeamMemberCapacity } from '@prisma/client';
import { CreateTeamMemberCapacityDto, UpdateTeamMemberCapacityDto } from 'src/dto';
export declare class TeamMemberCapacityController {
    private readonly teamMemberCapacityService;
    constructor(teamMemberCapacityService: TeamMemberCapacityService);
    create(createDto: CreateTeamMemberCapacityDto): Promise<TeamMemberCapacity>;
    findAll(sprintId: string): Promise<TeamMemberCapacity[]>;
    findOne(id: string): Promise<TeamMemberCapacity>;
    update(id: string, updateDto: UpdateTeamMemberCapacityDto): Promise<TeamMemberCapacity>;
    delete(id: string): Promise<boolean>;
}
