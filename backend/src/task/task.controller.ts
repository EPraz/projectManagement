import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, GetAllTasksDto, UpdateTaskDto } from 'src/dto';
import { Task } from '@prisma/client';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() request: CreateTaskDto): Promise<Task> {
    return await this.taskService.create(request);
  }

  @Get()
  async findAll(@Body() request: GetAllTasksDto): Promise<Task[]> {
    return await this.taskService.findAllByTicket(request.ticketId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Task> {
    return await this.taskService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() request: UpdateTaskDto,
  ): Promise<Task> {
    return await this.taskService.update({ ...request, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return await this.taskService.delete(id);
  }
}
