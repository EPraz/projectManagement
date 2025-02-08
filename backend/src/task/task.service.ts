import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Task } from '@prisma/client';
import { CreateTaskDto } from 'src/dto/create/CreateTaskDto';
import { UpdateTaskDto } from 'src/dto/update/UpdateTaskDto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // Create Task
  async create(request: CreateTaskDto): Promise<Task> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: request.ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    try {
      return await this.prisma.task.create({
        data: { ...request },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error Prisma: ${error.message}`,
        );
      }
      throw error;
    }
  }

  //   Get All Tasks
  async findAllByTicket(ticketId: number) {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) throw new NotFoundException('Ticket not found');

      return await this.prisma.task.findMany({
        where: { ticketId },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error Prisma: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.task.findUnique({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error Prisma: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async update(request: UpdateTaskDto) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: request.id },
      });

      if (!task) throw new NotFoundException('Task not found');

      return await this.prisma.task.update({
        where: { id: request.id },
        data: { ...request },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error Prisma: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error Prisma: ${error.message}`,
        );
      }
      throw error;
    }
  }
}
