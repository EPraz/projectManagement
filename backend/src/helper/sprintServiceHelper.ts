import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

//  Helper: Validar `featureId` y `sprintId`, asegurando que pertenecen al mismo `projectId`
export async function validateFeatureOrSprint(
  prisma: PrismaService,
  featureId?: string,
  sprintId?: string,
): Promise<string | null> {
  let projectId: string | null = null;

  if (featureId) {
    const feature = await prisma.feature.findUnique({
      where: { id: featureId },
      include: { epic: true },
    });

    if (!feature) throw new NotFoundException('Feature not found');
    projectId = feature.epic.projectId;
  }

  if (sprintId) {
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
    });

    if (!sprint) throw new NotFoundException('Sprint not found');

    if (projectId && projectId !== sprint.projectId) {
      throw new ConflictException(
        'Feature and Sprint do not belong to the same project',
      );
    }

    projectId = sprint.projectId;
  }

  return projectId;
}

//  Helper: Obtener el estado `NEW` para un `projectId`
export async function getNewStatus(prisma: PrismaService, projectId: string) {
  const status = await prisma.ticketStatus.findFirst({
    where: { projectId, name: 'NEW' },
  });

  if (!status)
    throw new NotFoundException('Default Ticket Status "NEW" not found');
  return status.id;
}
