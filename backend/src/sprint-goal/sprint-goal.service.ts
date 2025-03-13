import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { handlePrismaError } from 'src/helper';
import {
  CreateGoalTaskDto,
  CreateSprintGoalDto,
  UpdateGoalTaskDto,
  UpdateSprintGoalDto,
} from 'src/dto';
import { SprintGoal, GoalTask } from '@prisma/client';
import { SPRINT_GOAL_INCLUDE, SPRINT_INCLUDE } from 'src/constants';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Injectable()
export class SprintGoalService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  //  Crear un Sprint Goal
  public async createGoal(data: CreateSprintGoalDto): Promise<SprintGoal> {
    try {
      const response = await this.prisma.sprintGoal.create({
        data,
        include: SPRINT_GOAL_INCLUDE,
      });

      const sprint = await this.prisma.sprint.findUnique({
        where: { id: response.sprintId },
        include: SPRINT_INCLUDE,
      });

      if (sprint) this.eventsGateway.emitSprintUpdate(sprint);
      return response;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  //  Obtener Goals de un Sprint
  public async getSprintGoals(sprintId: string): Promise<SprintGoal[]> {
    try {
      return await this.prisma.sprintGoal.findMany({
        where: { sprintId },
        include: SPRINT_GOAL_INCLUDE,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  //  Actualizar un Sprint Goal
  public async updateGoal(request: UpdateSprintGoalDto): Promise<SprintGoal> {
    try {
      const { id, ...data } = request;
      const goal = await this.prisma.sprintGoal.findUnique({
        where: { id },
      });

      if (!goal) throw new NotFoundException('Sprint Goal not found');

      const response = await this.prisma.sprintGoal.update({
        where: { id },
        data,
        include: SPRINT_GOAL_INCLUDE,
      });

      const sprint = await this.prisma.sprint.findUnique({
        where: { id: response.sprintId },
        include: SPRINT_INCLUDE,
      });

      if (sprint) this.eventsGateway.emitSprintUpdate(sprint);
      return response;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  //  Eliminar un Sprint Goal
  public async deleteGoal(goalId: string): Promise<boolean> {
    try {
      const goal = await this.prisma.sprintGoal.findUnique({
        where: { id: goalId },
      });

      if (!goal) throw new NotFoundException('Sprint Goal not found');

      const response = await this.prisma.sprintGoal.delete({
        where: { id: goalId },
      });

      const sprint = await this.prisma.sprint.findUnique({
        where: { id: response.sprintId },
        include: SPRINT_INCLUDE,
      });

      if (sprint) this.eventsGateway.emitSprintUpdate(sprint);

      return true;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  //  Crear una nueva Goal Task
  public async createGoalTask(data: CreateGoalTaskDto): Promise<GoalTask> {
    try {
      const response = await this.prisma.goalTask.create({ data });

      const goal = await this.prisma.sprintGoal.findUnique({
        where: { id: data.goalId },
      });
      const sprint = await this.prisma.sprint.findUnique({
        where: { id: goal?.sprintId },
        include: SPRINT_INCLUDE,
      });

      if (sprint) this.eventsGateway.emitSprintUpdate(sprint);

      return response;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  //  Actualizar una Goal Task
  public async updateGoalTask(request: UpdateGoalTaskDto): Promise<GoalTask> {
    try {
      const { id, ...data } = request;
      const task = await this.prisma.goalTask.findUnique({
        where: { id },
      });

      if (!task) throw new NotFoundException('Goal Task not found');

      const response = await this.prisma.goalTask.update({
        where: { id },
        data,
      });

      const goal = await this.prisma.sprintGoal.findUnique({
        where: { id: task.goalId },
      });
      const sprint = await this.prisma.sprint.findUnique({
        where: { id: goal?.sprintId },
        include: SPRINT_INCLUDE,
      });

      if (sprint) this.eventsGateway.emitSprintUpdate(sprint);

      return response;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  //  Eliminar una Goal Task
  public async deleteGoalTask(goalTaskId: string): Promise<boolean> {
    try {
      const task = await this.prisma.goalTask.findUnique({
        where: { id: goalTaskId },
      });

      if (!task) throw new NotFoundException('Goal Task not found');

      await this.prisma.goalTask.delete({
        where: { id: goalTaskId },
      });

      return true;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
