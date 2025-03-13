import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Project, User } from '@prisma/client';
import {
  defaultEpicStatuses,
  defaultFeatureStatuses,
  defaultTaskStatuses,
  defaultTicketStatuses,
  PROJECT_INCLUDE,
} from 'src/constants';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto';
import { checkDuplicateTitle, handlePrismaError } from 'src/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // Create project
  async create(request: CreateProjectDto): Promise<Project | null> {
    try {
      await checkDuplicateTitle(this.prisma, 'project', request.title);

      return await this.prisma.$transaction(async (prisma) => {
        const newProject = await prisma.project.create({
          data: {
            ...request,
          },
        });

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

        return prisma.project.findUnique({
          where: { id: newProject.id },
          include: PROJECT_INCLUDE,
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
        include: PROJECT_INCLUDE,
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
        include: PROJECT_INCLUDE,
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

      const response = await this.prisma.project.update({
        where: { id: request.id },
        data: { ...request },
        include: PROJECT_INCLUDE,
      });

      this.eventsGateway.emitProjectUpdate(response);
      return response;
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

  async assignUserToProject(
    projectId: string,
    userId: string,
  ): Promise<User[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { users: true },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (project.users.some((u) => u.id === userId)) {
      throw new ConflictException('User already assigned to this project');
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
      include: PROJECT_INCLUDE,
    });

    this.eventsGateway.emitProjectUpdate(updatedProject);

    return updatedProject.users;
  }

  async removeUserFromProject(
    projectId: string,
    userId: string,
  ): Promise<User[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { users: true },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const response = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
      include: PROJECT_INCLUDE,
    });

    this.eventsGateway.emitProjectUpdate(response);
    return response.users;
  }
}
