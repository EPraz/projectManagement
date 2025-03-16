export declare class UpdateTaskDto {
    id: number;
    updatedBy: string;
    statusId: string;
    title: string;
    description?: string;
    discussion?: string;
    assignedTo?: string;
    estimatedHours: number;
    remainingHours: number;
    completedHours: number;
}
