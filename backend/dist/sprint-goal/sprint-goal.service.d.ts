import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalTaskDto, CreateSprintGoalDto, UpdateGoalTaskDto, UpdateSprintGoalDto } from 'src/dto';
import { SprintGoal, GoalTask } from '@prisma/client';
import { EventsGateway } from 'src/webSockets/events.gateway';
export declare class SprintGoalService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    createGoal(data: CreateSprintGoalDto): Promise<SprintGoal>;
    getSprintGoals(sprintId: string): Promise<SprintGoal[]>;
    updateGoal(request: UpdateSprintGoalDto): Promise<SprintGoal>;
    deleteGoal(goalId: string): Promise<boolean>;
    createGoalTask(data: CreateGoalTaskDto): Promise<GoalTask>;
    updateGoalTask(request: UpdateGoalTaskDto): Promise<GoalTask>;
    deleteGoalTask(goalTaskId: string): Promise<boolean>;
}
