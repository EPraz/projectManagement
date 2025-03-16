import { CreateGoalTaskDto, CreateSprintGoalDto, UpdateGoalTaskDto, UpdateSprintGoalDto } from 'src/dto';
import { SprintGoalService } from './sprint-goal.service';
import { GoalTask, SprintGoal } from '@prisma/client';
export declare class SprintGoalController {
    private readonly sprintGoalService;
    constructor(sprintGoalService: SprintGoalService);
    createGoal(data: CreateSprintGoalDto): Promise<SprintGoal>;
    updateGoal(goalId: string, data: UpdateSprintGoalDto): Promise<SprintGoal>;
    deleteGoal(goalId: string): Promise<boolean>;
    getSprintGoals(sprintId: string): Promise<SprintGoal[]>;
    createGoalTask(data: CreateGoalTaskDto): Promise<GoalTask>;
    updateGoalTask(goalTaskId: string, data: UpdateGoalTaskDto): Promise<GoalTask>;
    deleteGoalTask(goalTaskId: string): Promise<boolean>;
}
