import { SprintService } from './sprint.service';
import { CreateSprintDto, UpdateSprintDto } from 'src/dto';
import { Sprint } from '@prisma/client';
export declare class SprintController {
    private readonly sprintService;
    constructor(sprintService: SprintService);
    create(request: CreateSprintDto): Promise<Sprint>;
    findAll(projectId: string): Promise<Sprint[]>;
    findOne(id: string): Promise<Sprint>;
    update(id: string, request: UpdateSprintDto): Promise<Sprint>;
    delete(id: string): Promise<boolean>;
}
