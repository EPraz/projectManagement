import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { EpicService } from './epic.service';
import { CreateEpicDto, GetAllEpicsDto, UpdateEpicDto } from 'src/dto';
import { Epic } from '@prisma/client';

@Controller('epics')
export class EpicController {
  constructor(private readonly epicService: EpicService) {}

  @Post()
  async create(@Body() request: CreateEpicDto): Promise<Epic> {
    return await this.epicService.create(request);
  }

  @Get()
  async findAll(@Body() request: GetAllEpicsDto): Promise<Epic[]> {
    return await this.epicService.findAll(request.projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Epic | null> {
    return await this.epicService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateEpicDto,
  ): Promise<Epic> {
    return await this.epicService.update({ ...request, id });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.epicService.delete(id);
  }
}
