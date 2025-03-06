import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import {
  CreateGoalTaskDto,
  CreateSprintGoalDto,
  UpdateGoalTaskDto,
  UpdateSprintGoalDto,
} from 'src/dto';
import { SprintGoalService } from './sprint-goal.service';
import { GoalTask, SprintGoal } from '@prisma/client';

@Controller('sprint-goals')
export class SprintGoalController {
  constructor(private readonly sprintGoalService: SprintGoalService) {}

  @Post()
  async createGoal(@Body() data: CreateSprintGoalDto): Promise<SprintGoal> {
    return await this.sprintGoalService.createGoal(data);
  }

  @Patch(':goalId')
  async updateGoal(
    @Param('goalId') goalId: string,
    @Body() data: UpdateSprintGoalDto,
  ): Promise<SprintGoal> {
    return await this.sprintGoalService.updateGoal({ ...data, id: goalId });
  }

  @Delete(':goalId')
  async deleteGoal(@Param('goalId') goalId: string): Promise<boolean> {
    return await this.sprintGoalService.deleteGoal(goalId);
  }

  @Get(':sprintId')
  async getSprintGoals(
    @Param('sprintId') sprintId: string,
  ): Promise<SprintGoal[]> {
    return await this.sprintGoalService.getSprintGoals(sprintId);
  }

  @Post('goalTask')
  async createGoalTask(@Body() data: CreateGoalTaskDto): Promise<GoalTask> {
    return await this.sprintGoalService.createGoalTask(data);
  }

  @Patch('goalTask/:goalTaskId')
  async updateGoalTask(
    @Param('goalTaskId') goalTaskId: string,
    @Body() data: UpdateGoalTaskDto,
  ): Promise<GoalTask> {
    return await this.sprintGoalService.updateGoalTask({
      ...data,
      id: goalTaskId,
    });
  }

  @Delete('goalTask/:goalTaskId')
  async deleteGoalTask(
    @Param('goalTaskId') goalTaskId: string,
  ): Promise<boolean> {
    return await this.sprintGoalService.deleteGoalTask(goalTaskId);
  }
}
