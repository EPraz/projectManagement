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
import { SPRINT_GOAL_INCLUDE } from 'src/constants';
import { commitSprintChange } from '../helper/commitSprintChange';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Injectable()
export class SprintGoalService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  private async requireGoal(id: string) {
    const goal = await this.prisma.sprintGoal.findUnique({ where: { id } });
    if (!goal) throw new NotFoundException('Sprint Goal not found');
    return goal;
  }

  public async createGoal(data: CreateSprintGoalDto) {
    try {
      return await commitSprintChange(
        this.prisma,
        this.eventsGateway,
        data.sprintId,
        (tx) => tx.sprintGoal.create({ data, include: SPRINT_GOAL_INCLUDE }),
      );
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
      const goal = await this.requireGoal(id);
      return await commitSprintChange(
        this.prisma,
        this.eventsGateway,
        goal.sprintId,
        (tx) =>
          tx.sprintGoal.update({
            where: { id },
            data,
            include: SPRINT_GOAL_INCLUDE,
          }),
      );
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async deleteGoal(id: string) {
    try {
      const goal = await this.requireGoal(id);
      return await commitSprintChange(
        this.prisma,
        this.eventsGateway,
        goal.sprintId,
        async (tx) => {
          await tx.sprintGoal.delete({ where: { id } });
          return true;
        },
      );
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  // Task and aggregate changes form one transaction and one confirmed event.
  private async changeChecklist<T>(
    goalId: string,
    change: (tx: Prisma.TransactionClient) => Promise<T>,
  ) {
    const parent = await this.requireGoal(goalId);
    return await commitSprintChange(
      this.prisma,
      this.eventsGateway,
      parent.sprintId,
      async (tx) => {
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
        return value;
      },
    );
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
