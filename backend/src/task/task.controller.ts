import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'src/dto/create/CreateTaskDto';
import { UpdateTaskDto } from 'src/dto/update/UpdateTaskDto';

@Controller('project/:projectId/tickets/:ticketId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Param('ticketId') ticketId: number, request: CreateTaskDto) {
    return await this.taskService.create({ ...request, ticketId });
  }

  @Get()
  async findAll(@Param('ticketId') ticketId: number) {
    return await this.taskService.findAllByTicket(ticketId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.taskService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, request: UpdateTaskDto) {
    return await this.taskService.update({ ...request, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.taskService.delete(id);
  }
}
