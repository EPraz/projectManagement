import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SprintService } from './sprint.service';
import { CreateSprintDto, UpdateSprintDto } from 'src/dto';
import { Sprint } from '@prisma/client';
// import { GetAllSprintsDto } from 'src/dto/getAll/GetAllSprintsDto';

@Controller('sprints')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post()
  async create(@Body() request: CreateSprintDto): Promise<Sprint> {
    return await this.sprintService.create(request);
  }

  @Get('project/:projectId')
  async findAll(@Param(':projectId') projectId: string): Promise<Sprint[]> {
    return await this.sprintService.getSprintsByProject(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.sprintService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() request: UpdateSprintDto) {
    return await this.sprintService.update({ ...request, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.sprintService.delete(id);
  }
}
