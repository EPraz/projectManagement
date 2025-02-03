import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Epic, Prisma } from '@prisma/client';
import { CreateEpicDto, UpdateEpicDto } from 'src/dto';

@Injectable()
export class EpicService {
  constructor(private readonly prisma: PrismaService) {}

  //Create Epic
  async create(request: CreateEpicDto): Promise<Epic> {
    const project = await this.prisma.project.findUnique({
      where: { id: request.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    try {
      return await this.prisma.epic.create({
        data: request,
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Error creating epic');
    }
  }

  //Search All Epic
  async findAll(projectId: string): Promise<Epic[]> {
    try {
      return await this.prisma.epic.findMany({ where: { projectId } });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Error fetching epics');
    }
  }

  //Search Specific Epic
  async findOne(id: string): Promise<Epic | null> {
    try {
      return await this.prisma.epic.findUnique({ where: { id } });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Error fetching epic');
    }
  }

  //Update All Epic
  async update(request: UpdateEpicDto): Promise<Epic> {
    const epic = await this.prisma.epic.findUnique({
      where: { id: request.id },
    });

    if (!epic) {
      throw new NotFoundException('Epic not found');
    }

    try {
      return await this.prisma.epic.update({
        where: { id: request.id },
        data: request,
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        `Error updating epic #${request.id}`,
      );
    }
  }

  //Delete Epic
  async delete(id: string): Promise<Epic> {
    const epic = await this.prisma.epic.findUnique({
      where: { id },
    });

    if (!epic) {
      throw new NotFoundException('Epic not found');
    }

    try {
      return await this.prisma.epic.delete({ where: { id } });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(`Error deleting epic #${id}`);
    }
  }
}
