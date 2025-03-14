import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project, User } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Crear un nuevo proyecto
  @Roles('ADMIN') // Solo los ADMIN pueden acceder
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project | null> {
    return await this.projectService.create(createProjectDto);
  }

  // Obtener todos los proyectos
  @Get()
  async findAll(@Req() req: Request): Promise<Project[]> {
    if (!req.user) throw new UnauthorizedException('Not authenticated');
    return await this.projectService.findAll();
  }

  // Obtener un proyecto por ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project> {
    return await this.projectService.findOne(id);
  }

  // Actualizar un proyecto
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return await this.projectService.update({ ...updateProjectDto, id });
  }

  // Eliminar un proyecto
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.projectService.remove(id);
  }

  // Asignar un usuario a un proyecto
  //  @UseGuards(AuthGuard('jwt'), RolesGuard)
  //  @Roles('ADMIN', 'PROJECT_MANAGER') // Por ejemplo, roles que pueden asignar usuarios
  @Post(':projectId/users/:userId')
  async assignUser(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ): Promise<User[]> {
    return await this.projectService.assignUserToProject(projectId, userId);
  }

  // Remover un usuario de un proyecto
  //  @UseGuards(AuthGuard('jwt'), RolesGuard)
  //  @Roles('ADMIN', 'PROJECT_MANAGER')
  @Delete(':projectId/users/:userId')
  async removeUser(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return await this.projectService.removeUserFromProject(projectId, userId);
  }
}
