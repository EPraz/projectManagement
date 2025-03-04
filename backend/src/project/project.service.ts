import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from '@prisma/client';
import {
  defaultEpicStatuses,
  defaultFeatureStatuses,
  defaultTaskStatuses,
  defaultTicketStatuses,
} from 'src/constants';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto';
import { checkDuplicateTitle, handlePrismaError } from 'src/helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  // Create project
  async create(request: CreateProjectDto): Promise<Project | null> {
    try {
      await checkDuplicateTitle(this.prisma, 'project', request.title);

      return await this.prisma.$transaction(async (prisma) => {
        const newProject = await prisma.project.create({
          data: {
            ...request,
            // Aquí se podrían agregar los usuarios si es necesario en el futuro
          },
        });

        // Crear Status por defecto con `projectId`
        await prisma.epicStatus.createMany({
          data: defaultEpicStatuses.map((status) => ({
            ...status,
            projectId: String(newProject.id),
          })),
        });

        await prisma.featureStatus.createMany({
          data: defaultFeatureStatuses.map((status) => ({
            ...status,
            projectId: String(newProject.id),
          })),
        });

        await prisma.ticketStatus.createMany({
          data: defaultTicketStatuses.map((status) => ({
            ...status,
            projectId: String(newProject.id),
          })),
        });

        await prisma.taskStatus.createMany({
          data: defaultTaskStatuses.map((status) => ({
            ...status,
            projectId: String(newProject.id),
          })),
        });

        // Retornar el Proyecto con los Status creados
        return prisma.project.findUnique({
          where: { id: newProject.id },
          include: {
            _count: true,
            epics: {
              include: {
                _count: true,
                features: true,
                status: true,
              },
            },
            users: true,
            sprints: {
              include: {
                tickets: {
                  include: {
                    status: true,
                    tasks: {
                      include: {
                        status: true,
                      },
                    },
                  },
                },
              },
            },
            ticketStatuses: true,
            taskStatuses: true,
            epicStatuses: true,
            featureStatuses: true,
          },
        });
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  // Get All Projects
  async findAll(): Promise<Project[]> {
    try {
      return await this.prisma.project.findMany({
        include: {
          _count: true,
          epics: {
            include: {
              _count: true,
              features: true,
              status: true,
            },
          },
          users: true,
          sprints: {
            include: {
              tickets: {
                include: {
                  status: true,
                  tasks: {
                    include: {
                      status: true,
                    },
                  },
                },
              },
            },
          },
          ticketStatuses: true,
          taskStatuses: true,
          epicStatuses: true,
          featureStatuses: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  // Get Project By ID
  async findOne(id: string): Promise<Project> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
        include: {
          _count: true,
          epics: {
            include: {
              _count: true,
              features: true,
              status: true,
            },
          },
          users: true,
          sprints: {
            include: {
              tickets: {
                include: {
                  status: true,
                  tasks: {
                    include: {
                      status: true,
                    },
                  },
                },
              },
            },
          },
          tickets: {
            include: {
              status: true,
              tasks: {
                include: {
                  status: true,
                },
              },
            },
          },
          ticketStatuses: true,
          taskStatuses: true,
          epicStatuses: true,
          featureStatuses: true,
        },
      });

      if (!project) throw new NotFoundException(`Project #${id} not found!`);

      return project;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  // Update Project
  async update(request: UpdateProjectDto): Promise<Project> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: request.id },
      });

      if (!project)
        throw new NotFoundException(`Project #${request.id} not found!`);

      if (request.title)
        await checkDuplicateTitle(this.prisma, 'project', request.title);

      return await this.prisma.project.update({
        where: { id: request.id },
        data: { ...request },
        include: {
          _count: true,
          epics: {
            include: {
              _count: true,
              features: true,
              status: true,
            },
          },
          users: true,
          sprints: {
            include: {
              tickets: {
                include: {
                  status: true,
                  tasks: {
                    include: {
                      status: true,
                    },
                  },
                },
              },
            },
          },
          ticketStatuses: true,
          taskStatuses: true,
          epicStatuses: true,
          featureStatuses: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  // Delete Project
  async remove(id: string): Promise<boolean> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
      });

      if (!project) throw new NotFoundException(`Project #${id} not found!`);

      await this.prisma.project.delete({ where: { id } });

      return true;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
}
