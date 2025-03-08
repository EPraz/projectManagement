import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Crear un nuevo proyecto
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN') // Solo los ADMIN pueden acceder
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project | null> {
    return await this.projectService.create(createProjectDto);
  }

  // Obtener todos los proyectos
  @Get()
  async findAll(): Promise<Project[]> {
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
}
