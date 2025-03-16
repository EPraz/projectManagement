import { PrismaService } from '../prisma/prisma.service';
export declare function validateFeatureOrSprint(prisma: PrismaService, featureId?: string, sprintId?: string): Promise<string | null>;
export declare function getNewStatus(prisma: PrismaService, projectId: string): Promise<string>;
