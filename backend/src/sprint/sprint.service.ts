import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Sprint } from '@prisma/client';
import { CreateSprintDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SprintService {
  constructor(private prisma: PrismaService) {}

  // Create Sprint
  async create(request: CreateSprintDto): Promise<Sprint> {
    const project = await this.prisma.project.findUnique({
      where: { id: request.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    try {
      return await this.prisma.sprint.create({
        data: { ...request },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Error creating sprint');
    }
  }

  async getSprintsByProject(projectId: string): Promise<Sprint[]> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return await this.prisma.sprint.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error Prisma: ${error.message}`,
        );
      }
      throw error;
    }
  }
}
