import { EpicService } from './epic.service';
import { CreateEpicDto, GetAllEpicsDto, UpdateEpicDto } from 'src/dto';
import { Epic } from '@prisma/client';
export declare class EpicController {
    private readonly epicService;
    constructor(epicService: EpicService);
    create(request: CreateEpicDto): Promise<Epic>;
    findAll(request: GetAllEpicsDto): Promise<Epic[]>;
    findOne(id: string): Promise<Epic | null>;
    update(id: string, request: UpdateEpicDto): Promise<Epic>;
    remove(id: string): Promise<boolean>;
}
