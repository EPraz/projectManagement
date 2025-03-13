import { Injectable, NotFoundException } from '@nestjs/common';
import { Sprint } from '@prisma/client';
import { SPRINT_INCLUDE } from 'src/constants';
import { CreateSprintDto, UpdateSprintDto } from 'src/dto';
import { handlePrismaError } from 'src/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Injectable()
export class SprintService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // Create Sprint
  public async create(request: CreateSprintDto): Promise<Sprint> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: request.projectId },
      });

      if (!project) throw new NotFoundException('Project not found');

      const response = await this.prisma.sprint.create({
        data: { ...request },
        include: SPRINT_INCLUDE,
      });

      this.eventsGateway.emitSprintCreate(response);
      return response;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async getSprintsByProject(projectId: string): Promise<Sprint[]> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) throw new NotFoundException('Project not found');

      return await this.prisma.sprint.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
        include: SPRINT_INCLUDE,
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async findOne(id: string): Promise<Sprint> {
    try {
      const sprint = await this.prisma.sprint.findUnique({
        where: { id },
        include: SPRINT_INCLUDE,
      });

      if (!sprint) throw new NotFoundException('Sprint not found');

      return sprint;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async update(request: UpdateSprintDto): Promise<Sprint> {
    try {
      const sprint = await this.prisma.sprint.findUnique({
        where: { id: request.id },
        include: SPRINT_INCLUDE,
      });

      if (!sprint) throw new NotFoundException('Sprint not found');

      const { tickets, ...updateData } = request;

      const response = await this.prisma.sprint.update({
        where: { id: request.id },
        data: {
          ...updateData,
          ...(tickets && {
            tickets: {
              updateMany: tickets.map((ticket) => ({
                where: { id: ticket.id },
                data: {
                  ...tickets,
                },
              })),
            },
          }),
        },
        include: SPRINT_INCLUDE,
      });

      this.eventsGateway.emitSprintUpdate(response);
      return response;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const sprint = await this.prisma.sprint.findUnique({
        where: { id },
      });

      if (!sprint) throw new NotFoundException('Sprint not found');

      const response = await this.prisma.sprint.delete({
        where: { id },
      });

      this.eventsGateway.emitSprintDelete(response);

      return true;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
}
