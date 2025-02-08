import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto } from 'src/dto';
import { Prisma, Ticket } from '@prisma/client';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async create(request: CreateTicketDto): Promise<Ticket> {
    const feature = await this.prisma.feature.findUnique({
      where: { id: request.featureId },
    });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    try {
      return this.prisma.ticket.create({
        data: { ...request },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Prisma Error: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async findAllByFeature(featureId: string): Promise<Ticket[]> {
    try {
      return this.prisma.ticket.findMany({
        where: { featureId },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error Prisma: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async findOne(id: number): Promise<Ticket | null> {
    try {
      return await this.prisma.ticket.findUnique({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error Prisma: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async update(request: UpdateTicketDto): Promise<Ticket> {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: request.id },
      });

      if (!ticket) throw new NotFoundException('Ticket not found');

      return await this.prisma.ticket.update({
        where: { id: request.id },
        data: { ...request },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error Prisma: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async delete(id: number): Promise<Ticket> {
    try {
      return this.prisma.ticket.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error Prisma: ${error.message}`,
        );
      }
      throw error;
    }
  }
}
