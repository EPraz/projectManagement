import { Controller, Get, Param, Post } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { CreateSprintDto } from 'src/dto';

@Controller('projects/:projectId/sprints')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Get()
  async findAll(@Param('projectId') projectId: string) {
    return await this.sprintService.getSprintsByProject(projectId);
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    request: CreateSprintDto,
  ) {
    return await this.sprintService.create({ ...request, projectId });
  }
}
