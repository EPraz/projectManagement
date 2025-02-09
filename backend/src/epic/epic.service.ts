import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Epic } from '@prisma/client';
import { CreateEpicDto, UpdateEpicDto } from 'src/dto';
import { checkDuplicateTitle, handlePrismaError } from 'src/helper';

@Injectable()
export class EpicService {
  constructor(private readonly prisma: PrismaService) {}

  //Create Epic
  async create(request: CreateEpicDto): Promise<Epic> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: request.projectId },
      });

      if (!project)
        throw new NotFoundException(`Project #${request.projectId} not found`);

      await checkDuplicateTitle(this.prisma, 'epic', request.title);

      const newStatus = await this.prisma.epicStatus.findFirst({
        where: { projectId: request.projectId, name: 'NEW' },
      });

      return await this.prisma.epic.create({
        data: { ...request, statusId: newStatus?.id },
        include: {
          features: true,
          status: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  //Search All Epic
  async findAll(projectId: string): Promise<Epic[]> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException(`Project #${projectId} not found`);
      }

      return await this.prisma.epic.findMany({
        where: { projectId },
        include: {
          _count: true,
          features: true,
          status: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  //Search Specific Epic
  async findOne(id: string): Promise<Epic | null> {
    try {
      const epic = await this.prisma.epic.findUnique({
        where: { id },
      });

      if (!epic) throw new NotFoundException(`Epic #${id} not found`);

      return await this.prisma.epic.findUnique({
        where: { id },
        include: {
          features: true,
          status: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  //Update All Epic
  async update(request: UpdateEpicDto): Promise<Epic> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: request.projectId },
      });

      if (!project) {
        throw new NotFoundException(`Project #${request.projectId} not found`);
      }

      const epic = await this.prisma.epic.findUnique({
        where: { id: request.id },
      });

      if (!epic) throw new NotFoundException(`Epic #${request.id} not found`);

      if (request.title)
        await checkDuplicateTitle(this.prisma, 'epic', request.title);

      return await this.prisma.epic.update({
        where: { id: request.id },
        data: request,
        include: {
          features: true,
          status: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  //Delete Epic
  async delete(id: string): Promise<boolean> {
    try {
      const epic = await this.prisma.epic.findUnique({
        where: { id },
      });

      if (!epic) throw new NotFoundException(`Epic #${id} not found`);

      await this.prisma.epic.delete({ where: { id } });

      return true;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
}
