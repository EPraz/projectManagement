import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TeamMemberCapacity } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateTeamMemberCapacityDto,
  UpdateTeamMemberCapacityDto,
} from 'src/dto';
import { handlePrismaError } from 'src/helper';

@Injectable()
export class TeamMemberCapacityService {
  constructor(private prisma: PrismaService) {}

  async create(
    createDto: CreateTeamMemberCapacityDto,
  ): Promise<TeamMemberCapacity> {
    try {
      // Verificar si ya existe un registro para el mismo usuario y sprint
      const existingRecord = await this.prisma.teamMemberCapacity.findFirst({
        where: {
          userId: createDto.userId,
          sprintId: createDto.sprintId,
        },
      });
      if (existingRecord) {
        throw new InternalServerErrorException(
          'Capacity record already exists for this user and sprint',
        );
      }
      return await this.prisma.teamMemberCapacity.create({
        data: {
          userId: createDto.userId,
          sprintId: createDto.sprintId,
          capacity: createDto.capacity,
          daysOff: createDto.daysOff,
          remainingWork: createDto.remainingWork,
        },
        include: { user: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findAllBySprint(sprintId: string): Promise<TeamMemberCapacity[]> {
    try {
      return await this.prisma.teamMemberCapacity.findMany({
        where: { sprintId },
        include: { user: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findOne(id: string): Promise<TeamMemberCapacity> {
    try {
      const record = await this.prisma.teamMemberCapacity.findUnique({
        where: { id },
        include: { user: true },
      });
      if (!record) {
        throw new NotFoundException(`Record #${id} not found`);
      }
      return record;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(
    id: string,
    updateDto: UpdateTeamMemberCapacityDto,
  ): Promise<TeamMemberCapacity> {
    try {
      const record = await this.prisma.teamMemberCapacity.findUnique({
        where: { id },
      });
      if (!record) {
        throw new NotFoundException(`Record #${id} not found`);
      }
      return await this.prisma.teamMemberCapacity.update({
        where: { id },
        data: {
          capacity: updateDto.capacity,
          daysOff: updateDto.daysOff,
          remainingWork: updateDto.remainingWork,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const record = await this.prisma.teamMemberCapacity.findUnique({
        where: { id },
      });
      if (!record) {
        throw new NotFoundException(`Record #${id} not found`);
      }
      await this.prisma.teamMemberCapacity.delete({ where: { id } });
      return true;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
