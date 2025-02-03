import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { Role } from '@prisma/client';

@Controller('projects/:projectId/users')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @Post()
  async assignUser(
    @Param('projectId') projectId: string,
    @Body() body: { userId: string; role: Role },
  ) {
    return this.projectUserService.assignUserToProject(
      body.userId,
      projectId,
      body.role,
    );
  }

  @Delete(':userId')
  async removeUser(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.projectUserService.removeUserFromProject(userId, projectId);
  }

  @Get()
  async getUsers(@Param('projectId') projectId: string) {
    return this.projectUserService.getUsersByProject(projectId);
  }
}
