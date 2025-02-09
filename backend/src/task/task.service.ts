import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { handlePrismaError } from 'src/helper';
import { CreateTaskDto, UpdateTaskDto } from 'src/dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // Create Task
  async create(request: CreateTaskDto): Promise<Task> {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: request.ticketId },
      });

      if (!ticket) throw new NotFoundException('Ticket not found');

      const newTaskStatus = await this.prisma.taskStatus.findFirst({
        where: {
          projectId: ticket.projectId,
          name: 'TODO',
        },
      });

      console.log(newTaskStatus);
      return await this.prisma.task.create({
        data: { ...request, statusId: newTaskStatus?.id },
        include: {
          status: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  //   Get All Tasks
  async findAllByTicket(ticketId: number): Promise<Task[]> {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) throw new NotFoundException('Ticket not found');

      return await this.prisma.task.findMany({
        where: { ticketId },
        include: {
          status: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async findOne(id: number): Promise<Task> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
        include: {
          status: true,
        },
      });

      if (!task) throw new NotFoundException('Task not found');
      return task;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async update(request: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: request.id },
        include: {
          status: true,
        },
      });

      if (!task) throw new NotFoundException('Task not found');

      return await this.prisma.task.update({
        where: { id: request.id },
        data: { ...request },
        include: {
          status: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!task) throw new NotFoundException('Task not found');

      return true;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
}
