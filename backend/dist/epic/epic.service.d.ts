import { PrismaService } from '../prisma/prisma.service';
import { Epic } from '@prisma/client';
import { CreateEpicDto, UpdateEpicDto } from 'src/dto';
export declare class EpicService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(request: CreateEpicDto): Promise<Epic>;
    findAll(projectId: string): Promise<Epic[]>;
    findOne(id: string): Promise<Epic | null>;
    update(request: UpdateEpicDto): Promise<Epic>;
    delete(id: string): Promise<boolean>;
}
