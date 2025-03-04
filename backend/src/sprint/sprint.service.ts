import { Injectable, NotFoundException } from '@nestjs/common';
import { Sprint } from '@prisma/client';
import { CreateSprintDto, UpdateSprintDto } from 'src/dto';
import { handlePrismaError } from 'src/helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SprintService {
  constructor(private prisma: PrismaService) {}

  // Create Sprint
  public async create(request: CreateSprintDto): Promise<Sprint> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: request.projectId },
      });

      if (!project) throw new NotFoundException('Project not found');

      return await this.prisma.sprint.create({
        data: { ...request },
        include: {
          _count: true,
          tickets: {
            include: {
              tasks: {
                include: {
                  status: true,
                },
              },
              status: true,
            },
          },
        },
      });
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
        include: {
          _count: true,
          tickets: {
            include: {
              tasks: {
                include: {
                  status: true,
                },
              },
              status: true,
            },
          },
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async findOne(id: string): Promise<Sprint> {
    try {
      const sprint = await this.prisma.sprint.findUnique({
        where: { id },
        include: {
          _count: true,
          tickets: {
            include: {
              tasks: {
                include: {
                  status: true,
                },
              },
              status: true,
            },
          },
        },
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
        include: {
          _count: true,
          tickets: {
            include: {
              tasks: {
                include: {
                  status: true,
                },
              },
              status: true,
            },
          },
        },
      });

      if (!sprint) throw new NotFoundException('Sprint not found');

      const { tickets, ...updateData } = request;

      return await this.prisma.sprint.update({
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
        include: {
          _count: true,
          tickets: {
            include: {
              tasks: {
                include: {
                  status: true,
                },
              },
              status: true,
            },
          },
        },
      });
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

      await this.prisma.sprint.delete({
        where: { id },
      });

      return true;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
}
