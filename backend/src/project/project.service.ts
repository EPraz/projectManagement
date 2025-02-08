import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
          title: request.title,
          createdBy: request.createdBy,
          description: request.description,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw error;
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
      throw error;
    }
  }

  // Get Project By ID
  async findOne(id: string): Promise<Project | null> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
      });

      if (!project) throw new NotFoundException(`Project #${id} not found!`);

      return project;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw error;
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
      throw error;
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
      throw error;
    }
  }
}
