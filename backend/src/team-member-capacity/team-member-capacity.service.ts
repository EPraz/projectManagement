import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateTeamMemberCapacityDto,
  UpdateTeamMemberCapacityDto,
} from 'src/dto';
import { handlePrismaError } from 'src/helper';
import { commitSprintChange } from '../helper/commitSprintChange';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Injectable()
export class TeamMemberCapacityService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  private validateWork(capacity: number, remainingWork: number) {
    if (remainingWork > capacity)
      throw new BadRequestException(
        'Remaining work must be less than or equal to capacity',
      );
  }
  private async requireRecord(id: string) {
    const record = await this.prisma.teamMemberCapacity.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!record) throw new NotFoundException('Capacity record not found');
    return record;
  }

  async create(data: CreateTeamMemberCapacityDto) {
    try {
      this.validateWork(data.capacity, data.remainingWork);
      return await commitSprintChange(
        this.prisma,
        this.eventsGateway,
        data.sprintId,
        async (tx) => {
          const sprint = await tx.sprint.findUniqueOrThrow({
            where: { id: data.sprintId },
            include: {
              project: { select: { users: { select: { id: true } } } },
            },
          });
          if (!(await tx.user.findUnique({ where: { id: data.userId } })))
            throw new NotFoundException('User not found');
          if (!sprint.project.users.some((member) => member.id === data.userId))
            throw new BadRequestException(
              'Capacity can only be assigned to a member of this project',
            );
          if (
            await tx.teamMemberCapacity.findUnique({
              where: {
                userId_sprintId: {
                  userId: data.userId,
                  sprintId: data.sprintId,
                },
              },
            })
          )
            throw new ConflictException(
              'Capacity record already exists for this user and sprint',
            );
          return await tx.teamMemberCapacity.create({
            data,
            include: { user: true },
          });
        },
      );
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async findAllBySprint(sprintId: string) {
    try {
      if (!(await this.prisma.sprint.findUnique({ where: { id: sprintId } })))
        throw new NotFoundException('Sprint not found');
      return await this.prisma.teamMemberCapacity.findMany({
        where: { sprintId },
        include: { user: true },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
  async findOne(id: string) {
    return await this.requireRecord(id);
  }

  async update(id: string, data: UpdateTeamMemberCapacityDto) {
    try {
      const parent = await this.requireRecord(id);
      return await commitSprintChange(
        this.prisma,
        this.eventsGateway,
        parent.sprintId,
        async (tx) => {
          const record = await tx.teamMemberCapacity.findUnique({
            where: { id },
          });
          if (!record) throw new NotFoundException('Capacity record not found');
          this.validateWork(
            data.capacity ?? record.capacity,
            data.remainingWork ?? record.remainingWork,
          );
          return await tx.teamMemberCapacity.update({
            where: { id },
            data,
            include: { user: true },
          });
        },
      );
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async delete(id: string) {
    try {
      const record = await this.requireRecord(id);
      return await commitSprintChange(
        this.prisma,
        this.eventsGateway,
        record.sprintId,
        async (tx) => {
          await tx.teamMemberCapacity.delete({ where: { id } });
          return true;
        },
      );
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
}
