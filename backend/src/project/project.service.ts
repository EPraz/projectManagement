import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  // Create project
  async create(request: CreateProjectDto): Promise<Project> {
    try {
      return await this.prisma.project.create({
        data: {
          ...request,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Error creating project');
    }
  }

  // Get All Projects
  async findAll(): Promise<Project[]> {
    try {
      return await this.prisma.project.findMany();
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Error fetching projects');
    }
  }

  // Get Project By ID
  async findOne(id: string): Promise<Project | null> {
    try {
      return await this.prisma.project.findUnique({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Error fetching project');
    }
  }

  // Update Project
  async update(request: UpdateProjectDto): Promise<Project> {
    try {
      return await this.prisma.project.update({
        where: { id: request.id },
        data: { ...request },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Error updating project');
    }
  }

  // Delete Project
  async remove(id: string): Promise<Project> {
    try {
      return await this.prisma.project.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Error deleting project');
    }
  }
}
