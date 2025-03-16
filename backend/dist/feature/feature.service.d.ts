import { PrismaService } from '../prisma/prisma.service';
import { CreateFeatureDto, UpdateFeatureDto } from 'src/dto';
import { Feature } from '@prisma/client';
export declare class FeatureService {
    private prisma;
    constructor(prisma: PrismaService);
    create(request: CreateFeatureDto): Promise<Feature>;
    findAllByEpic(epicId: string): Promise<Feature[]>;
    findOne(id: string): Promise<Feature | null>;
    update(request: UpdateFeatureDto): Promise<Feature>;
    delete(id: string): Promise<boolean>;
}
