import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { handlePrismaError } from 'src/helper';
import {
  CreateGoalTaskDto,
  CreateSprintGoalDto,
  UpdateGoalTaskDto,
  UpdateSprintGoalDto,
} from 'src/dto';
import { Prisma } from '@prisma/client';
import { SPRINT_GOAL_INCLUDE, SPRINT_INCLUDE } from 'src/constants';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Injectable()
export class SprintGoalService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  private async publishSprint(sprintId: string) {
    const sprint = await this.prisma.sprint.findUnique({
      where: { id: sprintId },
      include: SPRINT_INCLUDE,
    });
    if (sprint) this.eventsGateway.emitSprintUpdate(sprint);
  }

  public async createGoal(data: CreateSprintGoalDto) {
    try {
      if (
        !(await this.prisma.sprint.findUnique({ where: { id: data.sprintId } }))
      )
        throw new NotFoundException('Sprint not found');
      const response = await this.prisma.sprintGoal.create({
        data,
        include: SPRINT_GOAL_INCLUDE,
      });
      await this.publishSprint(response.sprintId);
      return response;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async getSprintGoals(sprintId: string) {
    try {
      if (!(await this.prisma.sprint.findUnique({ where: { id: sprintId } })))
        throw new NotFoundException('Sprint not found');
      return await this.prisma.sprintGoal.findMany({
        where: { sprintId },
        include: SPRINT_GOAL_INCLUDE,
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async updateGoal(request: UpdateSprintGoalDto) {
    try {
      const { id, ...data } = request;
      if (!(await this.prisma.sprintGoal.findUnique({ where: { id } })))
        throw new NotFoundException('Sprint Goal not found');
      const response = await this.prisma.sprintGoal.update({
        where: { id },
        data,
        include: SPRINT_GOAL_INCLUDE,
      });
      await this.publishSprint(response.sprintId);
      return response;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async deleteGoal(id: string) {
    try {
      if (!(await this.prisma.sprintGoal.findUnique({ where: { id } })))
        throw new NotFoundException('Sprint Goal not found');
      const response = await this.prisma.sprintGoal.delete({ where: { id } });
      await this.publishSprint(response.sprintId);
      return true;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  // Serialize changes to one checklist so concurrent clients calculate from the
  // same committed tasks. The task, aggregate and emitted sprint are one outcome.
  private async changeChecklist<T>(
    goalId: string,
    change: (tx: Prisma.TransactionClient) => Promise<T>,
  ) {
    const result = await this.prisma.$transaction(async (tx) => {
      const locked = await tx.$queryRaw<
        { id: string }[]
      >`SELECT id FROM "SprintGoal" WHERE id = ${goalId} FOR UPDATE`;
      if (!locked.length) throw new NotFoundException('Sprint Goal not found');
      const value = await change(tx);
      const goal = await tx.sprintGoal.findUniqueOrThrow({
        where: { id: goalId },
        include: SPRINT_GOAL_INCLUDE,
      });
      const total = goal.goalTask.length;
      const progress = total
        ? Math.round(
            (goal.goalTask.filter((task) => task.completed).length / total) *
              100,
          )
        : 0;
      const goalsStatus =
        progress === 100
          ? 'COMPLETED'
          : goal.goalsStatus === 'COMPLETED'
            ? 'IN_PROGRESS'
            : goal.goalsStatus;
      await tx.sprintGoal.update({
        where: { id: goalId },
        data: { progress, goalsStatus },
      });
      const sprint = await tx.sprint.findUniqueOrThrow({
        where: { id: goal.sprintId },
        include: SPRINT_INCLUDE,
      });
      return { value, sprint };
    });
    this.eventsGateway.emitSprintUpdate(result.sprint);
    return result.value;
  }

  public async createGoalTask(data: CreateGoalTaskDto) {
    try {
      return await this.changeChecklist(data.goalId, (tx) =>
        tx.goalTask.create({ data }),
      );
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async updateGoalTask(request: UpdateGoalTaskDto) {
    try {
      const { id, ...data } = request;
      const task = await this.prisma.goalTask.findUnique({ where: { id } });
      if (!task) throw new NotFoundException('Goal Task not found');
      return await this.changeChecklist(task.goalId, (tx) =>
        tx.goalTask.update({ where: { id }, data }),
      );
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async deleteGoalTask(id: string) {
    try {
      const task = await this.prisma.goalTask.findUnique({ where: { id } });
      if (!task) throw new NotFoundException('Goal Task not found');
      return await this.changeChecklist(task.goalId, async (tx) => {
        await tx.goalTask.delete({ where: { id } });
        return true;
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
}
