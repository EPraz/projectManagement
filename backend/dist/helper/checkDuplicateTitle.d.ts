import { PrismaService } from '../prisma/prisma.service';
type ModelKeys = 'project' | 'epic' | 'feature';
export declare function checkDuplicateTitle(prisma: PrismaService, model: ModelKeys, title: string): Promise<void>;
export {};
