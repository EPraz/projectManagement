import { Ticket } from '@prisma/client';
export declare class UpdateSprintDto {
    projectId: string;
    name: string;
    tickets: Ticket[];
    startDate: Date;
    endDate: Date;
    id: string;
}
