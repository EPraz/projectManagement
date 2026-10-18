import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SPRINT_INCLUDE } from '../constants';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../webSockets/events.gateway';

// Full sprint events share one parent-first transaction boundary across the
// actual goal/checklist and capacity writers. Publish only after commit.
export async function commitSprintChange<T>(
  prisma: PrismaService,
  events: EventsGateway,
  sprintId: string,
  change: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  const result = await prisma.$transaction(async (tx) => {
    const locked = await tx.$queryRaw<
      { id: string }[]
    >`SELECT id FROM "Sprint" WHERE id = ${sprintId} FOR UPDATE`;
    if (!locked.length) throw new NotFoundException('Sprint not found');
    const value = await change(tx);
    const sprint = await tx.sprint.findUniqueOrThrow({
      where: { id: sprintId },
      include: SPRINT_INCLUDE,
    });
    return { value, sprint };
  });
  events.emitSprintUpdate(result.sprint);
  return result.value;
}
