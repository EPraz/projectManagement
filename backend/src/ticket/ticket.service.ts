import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, GetAllTicketsDto, UpdateTicketDto } from 'src/dto';
import { Ticket } from '@prisma/client';
import {
  getNewStatus,
  handlePrismaError,
  validateFeatureOrSprint,
} from 'src/helper';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async create(request: CreateTicketDto): Promise<Ticket | null> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const projectId = await validateFeatureOrSprint(
          this.prisma,
          request.featureId,
          request.sprintId,
        );

        const statusId = projectId
          ? await getNewStatus(this.prisma, projectId)
          : null;

        return await prisma.ticket.create({
          data: {
            ...request,
            projectId,
            statusId,
          },
          include: { _count: true, status: true, tasks: true },
        });
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findAllTickets(request: GetAllTicketsDto): Promise<Ticket[]> {
    try {
      await validateFeatureOrSprint(
        this.prisma,
        request.featureId,
        request.sprintId,
      );

      return this.prisma.ticket.findMany({
        where: {
          ...(request.featureId && { featureId: request.featureId }),
          ...(request.sprintId && { sprintId: request.sprintId }),
        },
        include: { status: true, _count: true, tasks: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findOne(id: number): Promise<Ticket | null> {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id },
        include: { _count: true, tasks: true, status: true },
      });

      if (!ticket) throw new NotFoundException(`Ticket #${id} not found`);
      return ticket;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(request: UpdateTicketDto): Promise<Ticket | null> {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: request.id },
      });

      if (!ticket) throw new NotFoundException('Ticket not found');

      return await this.prisma.ticket.update({
        where: { id: request.id },
        data: { ...request },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const ticket = await this.prisma.ticket.findUnique({ where: { id } });

      if (!ticket) throw new NotFoundException('Ticket not found');

      await this.prisma.ticket.delete({ where: { id } });
      return true;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
