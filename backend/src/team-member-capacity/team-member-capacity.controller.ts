import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TeamMemberCapacityService } from './team-member-capacity.service';
import { TeamMemberCapacity } from '@prisma/client';
import {
  CreateTeamMemberCapacityDto,
  UpdateTeamMemberCapacityDto,
} from 'src/dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('team-member-capacities')
// @UseGuards(JwtAuthGuard)
export class TeamMemberCapacityController {
  constructor(
    private readonly teamMemberCapacityService: TeamMemberCapacityService,
  ) {}

  @Post()
  async create(
    @Body() createDto: CreateTeamMemberCapacityDto,
  ): Promise<TeamMemberCapacity> {
    return await this.teamMemberCapacityService.create(createDto);
  }

  // Obtener registros según el sprint
  @Get()
  async findAll(
    @Query('sprintId') sprintId: string,
  ): Promise<TeamMemberCapacity[]> {
    if (sprintId) {
      return await this.teamMemberCapacityService.findAllBySprint(sprintId);
    }
    // Si no se proporciona sprintId, se podría devolver un error o todos los registros
    throw new Error('sprintId query parameter is required');
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TeamMemberCapacity> {
    return await this.teamMemberCapacityService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTeamMemberCapacityDto,
  ): Promise<TeamMemberCapacity> {
    return await this.teamMemberCapacityService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.teamMemberCapacityService.delete(id);
  }
}
