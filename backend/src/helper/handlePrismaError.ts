import { InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    throw new InternalServerErrorException(`Error Prisma: ${error.message}`);
  }
  throw error;
}
