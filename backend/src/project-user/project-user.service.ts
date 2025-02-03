import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProjectUser, Role } from '@prisma/client';

@Injectable()
export class ProjectUserService {
  constructor(private prisma: PrismaService) {}

  async assignUserToProject(
    userId: string,
    projectId: string,
    role: Role,
  ): Promise<ProjectUser> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    try {
      return await this.prisma.projectUser.create({
        data: { userId, projectId, role },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Error creating ProjectUser relation',
      );
    }
  }

  async removeUserFromProject(userId: string, projectId: string) {
    try {
      return await this.prisma.projectUser.deleteMany({
        where: { userId, projectId },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Error removing ProjectUser relation',
      );
    }
  }

  async getUsersByProject(projectId: string) {
    try {
      return await this.prisma.projectUser.findMany({
        where: { projectId },
        include: { user: true },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Error getting ProjectUser relation',
      );
    }
  }
}
