import { GoalStatus } from '@prisma/client';
export declare class UpdateSprintGoalDto {
    id: string;
    title?: string;
    description?: string;
    goalsStatus?: GoalStatus;
    progress?: number;
}
