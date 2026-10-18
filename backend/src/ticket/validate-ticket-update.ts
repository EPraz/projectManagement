import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTicketDto } from '../dto/update/UpdateTicketDto';

export async function validateTicketUpdate(
  prisma: PrismaService,
  ticket: { id: number; projectId: string | null },
  update: UpdateTicketDto,
) {
  if (update.statusId !== undefined) {
    const status =
      update.statusId &&
      (await prisma.ticketStatus.findUnique({
        where: { id: update.statusId },
      }));
    if (!status || status.projectId !== ticket.projectId)
      throw new BadRequestException('Status must belong to the ticket project');
  }
  if (update.sprintId) {
    const sprint = await prisma.sprint.findUnique({
      where: { id: update.sprintId },
    });
    if (!sprint || sprint.projectId !== ticket.projectId)
      throw new BadRequestException('Sprint must belong to the ticket project');
  }
  if (update.featureId) {
    const feature = await prisma.feature.findUnique({
      where: { id: update.featureId },
      select: { epic: { select: { projectId: true } } },
    });
    if (!feature || feature.epic.projectId !== ticket.projectId)
      throw new BadRequestException(
        'Feature must belong to the ticket project',
      );
  }
  if (update.blockedBy != null) {
    const blocker = await prisma.ticket.findUnique({
      where: { id: update.blockedBy },
    });
    if (
      !blocker ||
      blocker.id === ticket.id ||
      blocker.projectId !== ticket.projectId
    )
      throw new BadRequestException(
        'Blocking ticket must be another ticket in this project',
      );
  }
}
