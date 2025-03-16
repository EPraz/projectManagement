import { RetrospectiveService } from './retrospective.service';
import { RetroCard } from '@prisma/client';
import { CreateRetroCardDto, UpdateRetroCardDto } from 'src/dto';
export declare class RetrospectiveController {
    private readonly retrospectiveService;
    constructor(retrospectiveService: RetrospectiveService);
    create(createDto: CreateRetroCardDto): Promise<RetroCard>;
    findAll(sprintId?: string): Promise<RetroCard[]>;
    findOne(id: string): Promise<RetroCard>;
    update(id: string, updateDto: UpdateRetroCardDto): Promise<RetroCard>;
    delete(id: string): Promise<boolean>;
}
