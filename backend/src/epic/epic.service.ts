import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Epic } from '@prisma/client';
import { CreateEpicDto, UpdateEpicDto } from 'src/dto';
import { checkDuplicateTitle, handlePrismaError } from 'src/helper';
import { EventsGateway } from '../webSockets/events.gateway';

@Injectable()
export class EpicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
  ) {}

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

      const created = await this.prisma.epic.create({
        data: { ...request, statusId: newStatus?.id },
        include: {
          features: true,
          status: true,
        },
      });
      this.events.emitHierarchyChange(created.projectId);
      return created;
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

      if (epic.projectId !== request.projectId)
        throw new BadRequestException('Epic must remain in its project');

      if (request.statusId !== undefined) {
        const status =
          request.statusId &&
          (await this.prisma.epicStatus.findUnique({
            where: { id: request.statusId },
          }));
        if (!status || status.projectId !== epic.projectId)
          throw new BadRequestException(
            'Epic status must belong to its project',
          );
      }

      if (request.title)
        await checkDuplicateTitle(this.prisma, 'epic', request.title, epic.id);

      const updated = await this.prisma.epic.update({
        where: { id: request.id },
        data: request,
        include: {
          features: true,
          status: true,
        },
      });
      this.events.emitHierarchyChange(updated.projectId);
      return updated;
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

      this.events.emitHierarchyChange(epic.projectId);

      return true;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
}
