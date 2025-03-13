import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRetroCardDto, UpdateRetroCardDto } from 'src/dto';
import { RetroCard } from '@prisma/client';
import { handlePrismaError } from 'src/helper';
import { EventsGateway } from 'src/webSockets/events.gateway';
import { SPRINT_INCLUDE } from 'src/constants';

@Injectable()
export class RetrospectiveService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async create(createDto: CreateRetroCardDto): Promise<RetroCard> {
    try {
      const response = await this.prisma.retroCard.create({
        data: {
          content: createDto.content,
          type: createDto.type,
          authorId: createDto.authorId,
          sprintId: createDto.sprintId,
        },
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

  async findAll(sprintId?: string): Promise<RetroCard[]> {
    try {
      return await this.prisma.retroCard.findMany({
        where: sprintId ? { sprintId } : {},
        include: {
          author: true,
        },
        orderBy: { timestamp: 'asc' },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findOne(id: string): Promise<RetroCard> {
    try {
      const card = await this.prisma.retroCard.findUnique({
        where: { id },
        include: { author: true },
      });
      if (!card) throw new NotFoundException(`RetroCard #${id} not found`);
      return card;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, updateDto: UpdateRetroCardDto): Promise<RetroCard> {
    try {
      // Verificar existencia
      await this.findOne(id);
      const response = await this.prisma.retroCard.update({
        where: { id },
        data: updateDto,
        include: { author: true },
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

  async delete(id: string): Promise<boolean> {
    try {
      await this.findOne(id);
      const response = await this.prisma.retroCard.delete({ where: { id } });

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
}
