import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRetroCardDto, UpdateRetroCardDto } from 'src/dto';
import { handlePrismaError } from 'src/helper';
import { EventsGateway } from 'src/webSockets/events.gateway';
import { commitSprintChange } from '../helper/commitSprintChange';

@Injectable()
export class RetrospectiveService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  private async requireCard(id: string) {
    const card = await this.prisma.retroCard.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!card) throw new NotFoundException('Retrospective card not found');
    return card;
  }

  async create(data: CreateRetroCardDto, actorId: string) {
    try {
      return await commitSprintChange(
        this.prisma,
        this.eventsGateway,
        data.sprintId,
        async (tx) =>
          await tx.retroCard.create({
            data: {
              content: data.content,
              type: data.type,
              sprintId: data.sprintId,
              authorId: actorId,
            },
            include: { author: true },
          }),
      );
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async findAll(sprintId: string) {
    try {
      if (!(await this.prisma.sprint.findUnique({ where: { id: sprintId } })))
        throw new NotFoundException('Sprint not found');
      return await this.prisma.retroCard.findMany({
        where: { sprintId },
        include: { author: true },
        orderBy: { timestamp: 'asc' },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async findOne(id: string) {
    return await this.requireCard(id);
  }

  async update(id: string, data: UpdateRetroCardDto, actorId: string) {
    try {
      const parent = await this.requireCard(id);
      return await commitSprintChange(
        this.prisma,
        this.eventsGateway,
        parent.sprintId,
        async (tx) => {
          const card = await tx.retroCard.findUnique({ where: { id } });
          if (!card)
            throw new NotFoundException('Retrospective card not found');
          if (
            (data.authorId !== undefined && data.authorId !== card.authorId) ||
            (data.sprintId !== undefined && data.sprintId !== card.sprintId)
          )
            throw new BadRequestException(
              'Card author and sprint cannot be changed',
            );
          if (data.liked !== undefined && data.likedBy !== undefined)
            throw new BadRequestException('Provide one reaction intent');
          const liked =
            data.liked ??
            (data.likedBy !== undefined
              ? data.likedBy.includes(actorId)
              : undefined);
          const likedBy = [
            ...new Set(card.likedBy.filter((userId) => userId !== actorId)),
          ];
          if (
            liked === true ||
            (liked === undefined && card.likedBy.includes(actorId))
          )
            likedBy.push(actorId);
          return await tx.retroCard.update({
            where: { id },
            data: {
              content: data.content,
              type: data.type,
              ...(liked !== undefined && { likedBy, likes: likedBy.length }),
            },
            include: { author: true },
          });
        },
      );
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async delete(id: string) {
    try {
      const card = await this.requireCard(id);
      return await commitSprintChange(
        this.prisma,
        this.eventsGateway,
        card.sprintId,
        async (tx) => {
          await tx.retroCard.delete({ where: { id } });
          return true;
        },
      );
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
}
