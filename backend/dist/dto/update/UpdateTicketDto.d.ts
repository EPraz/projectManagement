import { TicketPriority, TicketType } from '@prisma/client';
export declare class UpdateTicketDto {
    id: number;
    title?: string;
    statusId?: string;
    sprintId?: string;
    description?: string;
    additionalDetails?: string;
    acceptanceCriteria?: string;
    designInformation?: string;
    notes?: string;
    priority?: TicketPriority;
    tags?: string[];
    assignedTo?: string;
    estimatedHours?: number;
    remainingHours?: number;
    completedHours?: number;
    storyPoints?: number;
    dueDate?: string;
    isBlocked?: boolean;
    blockedBy?: number;
    type?: TicketType;
    updatedBy: string;
    discussion?: string;
}
