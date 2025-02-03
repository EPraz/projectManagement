import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeatureDto, UpdateFeatureDto } from 'src/dto';
import { Feature, Prisma } from '@prisma/client';

@Injectable()
export class FeatureService {
  constructor(private prisma: PrismaService) {}

  async create(request: CreateFeatureDto): Promise<Feature> {
    const epic = await this.prisma.epic.findUnique({
      where: { id: request.epicId },
    });

    if (!epic) {
      throw new NotFoundException('Epic not found');
    }

    try {
      return await this.prisma.feature.create({
        data: { ...request },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(`Error creating feature`);
    }
  }

  async findAllByEpic(epicId: string) {
    try {
      return await this.prisma.feature.findMany({
        where: { epicId },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(`Error featching features`);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.feature.findUnique({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(`Error featching feature`);
    }
  }

  async update(request: UpdateFeatureDto): Promise<Feature> {
    const feature = await this.prisma.feature.findUnique({
      where: { id: request.id },
    });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    try {
      return await this.prisma.feature.update({
        where: { id: request.id },
        data: { ...request },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(`Error updating feature`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.feature.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de Prisma: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(`Error deleting feature`);
    }
  }
}
