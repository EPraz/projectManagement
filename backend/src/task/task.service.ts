import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { handlePrismaError } from 'src/helper';
import { CreateTaskDto, UpdateTaskDto } from 'src/dto';
import { EventsGateway } from 'src/webSockets/events.gateway';
import { TICKET_INCLUDE } from 'src/constants';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // Create Task
  public async create(request: CreateTaskDto): Promise<Task> {
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

      const newTask = await this.prisma.task.create({
        data: { ...request, statusId: newTaskStatus?.id },
        include: {
          status: true,
        },
      });

      const updatedticket = await this.prisma.ticket.findUnique({
        where: { id: request.ticketId },
        include: TICKET_INCLUDE,
      });

      if (updatedticket) this.eventsGateway.emitTicketUpdate(updatedticket);

      return newTask;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  //   Get All Tasks
  public async findAllByTicket(ticketId: number): Promise<Task[]> {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) throw new NotFoundException('Ticket not found');

      return await this.prisma.task.findMany({
        where: { ticketId },
        include: {
          status: true,
          assignedUser: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async findOne(id: number): Promise<Task> {
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

  public async update(request: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: request.id },
        include: {
          status: true,
        },
      });

      if (!task) throw new NotFoundException('Task not found');

      const { id, ...updateData } = request;

      const response = await this.prisma.task.update({
        where: { id },
        data: { ...updateData },
        include: {
          status: true,
        },
      });

      const ticket = await this.prisma.ticket.findUnique({
        where: { id: response.ticketId },
        include: TICKET_INCLUDE,
      });

      if (ticket) this.eventsGateway.emitTicketUpdate(ticket);

      return response;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!task) throw new NotFoundException('Task not found');

      await this.prisma.task.delete({
        where: { id },
      });

      const ticket = await this.prisma.ticket.findUnique({
        where: { id: task.ticketId },
        include: TICKET_INCLUDE,
      });

      if (ticket) this.eventsGateway.emitTicketUpdate(ticket);

      return true;
    } catch (error: unknown) {
      handlePrismaError(error);
    }
  }
}
