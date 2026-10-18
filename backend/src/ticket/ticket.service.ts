import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, GetAllTicketsDto, UpdateTicketDto } from 'src/dto';
import { Prisma, Ticket } from '@prisma/client';
import { BulkUpdateTicketDto } from './bulk-update-ticket.dto';
import {
  getNewStatus,
  handlePrismaError,
  validateFeatureOrSprint,
} from 'src/helper';
import { TICKET_INCLUDE } from 'src/constants';
import { EventsGateway } from 'src/webSockets/events.gateway';
import { validateTicketUpdate } from './validate-ticket-update';

const toTicketUpdateData = (
  request: Omit<UpdateTicketDto, 'id'> & { order?: number },
): Prisma.TicketUncheckedUpdateInput => {
  return {
    ...request,
    tags: request.tags
      ? {
          connectOrCreate: request.tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        }
      : undefined,
  };
};

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  public async create(request: CreateTicketDto): Promise<Ticket | null> {
    try {
      const newTicket = await this.prisma.$transaction(async (prisma) => {
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
          include: TICKET_INCLUDE,
        });
      });

      this.eventsGateway.emitTicketCreate(newTicket);

      return newTicket;
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
        include: TICKET_INCLUDE,
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
        include: TICKET_INCLUDE,
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

      await validateTicketUpdate(this.prisma, ticket, request);

      const { id, ...data } = request;
      const response = await this.prisma.ticket.update({
        where: { id },
        data: toTicketUpdateData(data),
        include: TICKET_INCLUDE,
      });

      this.eventsGateway.emitTicketUpdate(response);
      return response;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async bulkUpdate(
    request: BulkUpdateTicketDto[],
    actorEmail: string,
  ): Promise<Ticket[]> {
    try {
      const ids = request.map((ticket) => ticket.id);
      if (ids.length === 0 || new Set(ids).size !== ids.length)
        throw new BadRequestException(
          'Provide each intended ticket exactly once',
        );
      const updated = await this.prisma.$transaction(async (tx) => {
        // Every batch locks targets in the same order before validating/writing.
        const locked = await tx.$queryRaw<
          { id: number; projectId: string | null }[]
        >(
          Prisma.sql`SELECT "id", "projectId" FROM "Ticket" WHERE "id" IN (${Prisma.join(ids)}) ORDER BY "id" FOR UPDATE`,
        );
        if (locked.length !== ids.length)
          throw new NotFoundException('One or more tickets no longer exist');
        const targets = new Map(locked.map((ticket) => [ticket.id, ticket]));
        for (const ticket of request) {
          const target = targets.get(ticket.id)!;
          await validateTicketUpdate(tx, target, {
            ...ticket,
            updatedBy: actorEmail,
          });
        }
        for (const ticket of request) {
          const { id, ...data } = ticket;
          await tx.ticket.update({
            where: { id },
            data: toTicketUpdateData({ ...data, updatedBy: actorEmail }),
            select: { id: true },
          });
        }
        // Capture the final batch after every write, including dependent relations.
        const records = await tx.ticket.findMany({
          where: { id: { in: ids } },
          include: TICKET_INCLUDE,
        });
        const confirmed = new Map(records.map((ticket) => [ticket.id, ticket]));
        return ids.map((id) => confirmed.get(id)!);
      });
      for (const ticket of updated) this.eventsGateway.emitTicketUpdate(ticket);
      return updated;
    } catch (error: unknown) {
      handlePrismaError(error, 'ticket.bulkUpdate');
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const ticket = await this.prisma.ticket.findUnique({ where: { id } });

      if (!ticket) throw new NotFoundException('Ticket not found');

      await this.prisma.ticket.delete({ where: { id } });

      this.eventsGateway.emitTicketDelete(ticket);

      return true;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
