import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeatureDto, UpdateFeatureDto } from 'src/dto';
import { Feature } from '@prisma/client';
import { checkDuplicateTitle, handlePrismaError } from 'src/helper';

@Injectable()
export class FeatureService {
  constructor(private prisma: PrismaService) {}

  async create(request: CreateFeatureDto): Promise<Feature> {
    try {
      const epic = await this.prisma.epic.findUnique({
        where: { id: request.epicId },
      });

      if (!epic)
        throw new NotFoundException(`Epic #${request.epicId} not found`);

      await checkDuplicateTitle(this.prisma, 'feature', request.title);

      const newStatus = await this.prisma.featureStatus.findFirst({
        where: { projectId: epic.projectId, name: 'NEW' },
      });

      return await this.prisma.feature.create({
        data: { ...request, statusId: newStatus?.id },
        include: {
          status: true,
          tickets: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async findAllByEpic(epicId: string): Promise<Feature[]> {
    try {
      const epic = await this.prisma.epic.findUnique({
        where: { id: epicId },
      });

      if (!epic) throw new NotFoundException(`Epic #${epicId} not found`);

      return await this.prisma.feature.findMany({
        where: { epicId },
        include: {
          _count: true,
          status: true,
          tickets: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async findOne(id: string): Promise<Feature | null> {
    try {
      const feature = await this.prisma.feature.findUnique({
        where: { id },
      });

      if (!feature) throw new NotFoundException(`Feature #${id} not found`);

      return await this.prisma.feature.findUnique({
        where: { id },
        include: {
          _count: true,
          status: true,
          tickets: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async update(request: UpdateFeatureDto): Promise<Feature> {
    try {
      const epic = await this.prisma.epic.findUnique({
        where: { id: request.epicId },
      });

      if (!epic)
        throw new NotFoundException(`Feature #${request.epicId} not found`);

      const feature = await this.prisma.feature.findUnique({
        where: { id: request.id },
      });

      if (!feature)
        throw new NotFoundException(`Feature #${request.id} not found`);

      if (request.title)
        await checkDuplicateTitle(this.prisma, 'feature', request.title);

      return await this.prisma.feature.update({
        where: { id: request.id },
        data: { ...request },
        include: {
          _count: true,
          status: true,
          tickets: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const feature = await this.prisma.feature.findUnique({
        where: { id },
      });

      if (!feature) throw new NotFoundException(`Feature #${id} not found`);

      await this.prisma.feature.delete({
        where: { id },
      });

      return true;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
}
