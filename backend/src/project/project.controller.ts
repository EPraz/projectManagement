import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Crear un nuevo proyecto
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return await this.projectService.create(createProjectDto);
  }

  // Obtener todos los proyectos
  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectService.findAll();
  }

  // Obtener un proyecto por ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project | null> {
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
  async remove(@Param('id') id: string): Promise<Project> {
    return await this.projectService.remove(id);
  }
}
