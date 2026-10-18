import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

const logger = new Logger('Persistence');
export function handlePrismaError(
  error: unknown,
  operation = 'persistence',
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Codes are enough to classify failures; messages/meta may contain query data.
    const code = /^P\d{4}$/.test(error.code) ? error.code : 'unknown';
    logger.error(`${operation} failed [${code}]`);
    if (code === 'P2002')
      throw new ConflictException('A record with these values already exists');
    if (code === 'P2025')
      throw new NotFoundException('The requested record no longer exists');
    if (code === 'P2003')
      throw new BadRequestException(
        'A referenced record is invalid or no longer exists',
      );
    if (['P2024', 'P2037'].includes(code))
      throw new ServiceUnavailableException(
        'The database is temporarily unavailable. Please try again.',
      );
    throw new InternalServerErrorException(
      'Could not complete this operation. Please try again.',
    );
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    logger.error(`${operation} failed [database-unavailable]`);
    throw new ServiceUnavailableException(
      'The database is temporarily unavailable. Please try again.',
    );
  }
  if (
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    logger.error(`${operation} failed [database-query]`);
    throw new InternalServerErrorException(
      'Could not complete this operation. Please try again.',
    );
  }
  throw error;
}
