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
import { CreateEpicDto, UpdateEpicDto } from 'src/dto';

@Controller('projects/:projectId/epics')
export class EpicController {
  constructor(private readonly epicService: EpicService) {}

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() request: CreateEpicDto,
  ) {
    return await this.epicService.create({ ...request, projectId });
  }

  @Get()
  async findAll(@Param('projectId') projectId: string) {
    return await this.epicService.findAll(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.epicService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() request: UpdateEpicDto) {
    return await this.epicService.update({ ...request, id });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.epicService.delete(id);
  }
}
