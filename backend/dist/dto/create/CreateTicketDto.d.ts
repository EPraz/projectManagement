import { TicketPriority, TicketType } from '@prisma/client';
export declare class CreateTicketDto {
    title: string;
    description?: string;
    acceptanceCriteria?: string;
    discussion?: string;
    createdBy: string;
    featureId?: string;
    sprintId?: string;
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
    additionalDetails?: string;
    notes?: string;
    designInformation?: string;
}
