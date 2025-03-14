import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SprintService } from './sprint.service';
import { CreateSprintDto, UpdateSprintDto } from 'src/dto';
import { Sprint } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sprints')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post()
  async create(@Body() request: CreateSprintDto): Promise<Sprint> {
    return await this.sprintService.create(request);
  }

  @Get()
  async findAll(@Query('projectId') projectId: string): Promise<Sprint[]> {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }
    return await this.sprintService.getSprintsByProject(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sprint> {
    return await this.sprintService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateSprintDto,
  ): Promise<Sprint> {
    return await this.sprintService.update({ ...request, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.sprintService.delete(id);
  }
}
