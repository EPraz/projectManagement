import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

// Definir un tipo que mapea cada modelo a su delegado en Prisma
type ModelKeys = 'project' | 'epic' | 'feature';

export async function checkDuplicateTitle(
  prisma: PrismaService,
  model: ModelKeys,
  title: string,
) {
  let existingRecord: any;

  switch (model) {
    case 'project':
      existingRecord = await prisma.project.findFirst({
        where: { title: { equals: title.trim(), mode: 'insensitive' } },
      });
      break;
    case 'epic':
      existingRecord = await prisma.epic.findFirst({
        where: { title: { equals: title.trim(), mode: 'insensitive' } },
      });
      break;
    case 'feature':
      existingRecord = await prisma.feature.findFirst({
        where: { title: { equals: title.trim(), mode: 'insensitive' } },
      });
      break;
  }

  if (existingRecord) {
    throw new ConflictException(`This ${model} title already exists`);
  }
}
