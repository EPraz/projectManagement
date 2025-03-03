import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  BulkUpdateTicketsDto,
  CreateTicketDto,
  GetAllTicketsDto,
  UpdateTicketDto,
} from 'src/dto';
import { Ticket } from '@prisma/client';
import {
  getNewStatus,
  handlePrismaError,
  validateFeatureOrSprint,
} from 'src/helper';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  public async create(request: CreateTicketDto): Promise<Ticket | null> {
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

        const maxOrder = await prisma.ticket.aggregate({
          _max: {
            order: true,
          },
          where: {
            sprintId: request.sprintId ?? undefined,
            featureId: request.featureId ?? undefined,
          },
        });

        const nextOrder = (maxOrder._max.order ?? 0) + 1;

        return await prisma.ticket.create({
          data: {
            ...request,
            projectId,
            statusId,
            order: nextOrder,
            tags: request.tags
              ? {
                  connectOrCreate: request.tags.map((tag) => ({
                    where: { name: tag }, // Asegúrate de que en la tabla `Tag` haya un campo `name`
                    create: { name: tag },
                  })),
                }
              : undefined,
          },
          include: {
            _count: true,
            status: true,
            tasks: true,
            assignedUser: true,
            blockedTickets: true,
            blockingTicket: true,
            sprint: true,
            tags: true,
          },
        });
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async findAllTickets(request: GetAllTicketsDto): Promise<Ticket[]> {
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
        include: {
          status: true,
          _count: true,
          tasks: {
            include: {
              status: true,
            },
          },
          sprint: true,
          assignedUser: true,
          blockedTickets: true,
          blockingTicket: true,
          feature: true,
          project: true,
          tags: true,
        },
        orderBy: {
          order: 'asc',
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async findOne(id: number): Promise<Ticket | null> {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id },
        include: {
          _count: true,
          tasks: {
            include: {
              status: true,
            },
          },
          status: true,
          sprint: true,
          assignedUser: true,
          blockedTickets: true,
          blockingTicket: true,
          feature: true,
          project: true,
          tags: true,
        },
      });

      if (!ticket) throw new NotFoundException(`Ticket #${id} not found`);
      return ticket;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async update(request: UpdateTicketDto): Promise<Ticket | null> {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: request.id },
      });

      if (!ticket) throw new NotFoundException('Ticket not found');

      const { id, ...updateData } = request;

      return await this.prisma.ticket.update({
        where: { id },
        data: {
          ...updateData,
          tags: request.tags
            ? {
                connectOrCreate: request.tags.map((tag) => ({
                  where: { name: tag }, // Asegúrate de que en la tabla `Tag` haya un campo `name`
                  create: { name: tag },
                })),
              }
            : undefined,
        },
        include: {
          status: true,
          tasks: true,
          sprint: true,
          assignedUser: true,
          blockedTickets: true,
          blockingTicket: true,
          feature: true,
          project: true,
          tags: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async bulkUpdate(request: UpdateTicketDto[]): Promise<Ticket[]> {
    try {
      const updatedTickets = await this.prisma.$transaction(
        request.map((ticket) =>
          this.prisma.ticket.update({
            where: { id: ticket.id },
            data: {
              ...ticket,
              tags: ticket.tags
                ? {
                    connectOrCreate: ticket.tags.map((tag) => ({
                      where: { name: tag }, // Asegúrate de que en la tabla `Tag` haya un campo `name`
                      create: { name: tag },
                    })),
                  }
                : undefined,
            },
          }),
        ),
      );

      return updatedTickets;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deleteAll(): Promise<void> {
    await this.prisma.ticket.deleteMany();
  }

  public async delete(id: number): Promise<boolean> {
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
