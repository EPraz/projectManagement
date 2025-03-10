import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  //   UseGuards,
} from '@nestjs/common';
import { RetrospectiveService } from './retrospective.service';
import { RetroCard } from '@prisma/client';
import { CreateRetroCardDto, UpdateRetroCardDto } from 'src/dto';
// import { AuthGuard } from '@nestjs/passport';

@Controller('retrospectives')
// @UseGuards(AuthGuard('jwt'))
export class RetrospectiveController {
  constructor(private readonly retrospectiveService: RetrospectiveService) {}

  @Post()
  async create(@Body() createDto: CreateRetroCardDto): Promise<RetroCard> {
    return await this.retrospectiveService.create(createDto);
  }

  // Opción: filtrar por sprint mediante query parameter
  @Get()
  async findAll(@Query('sprintId') sprintId?: string): Promise<RetroCard[]> {
    return await this.retrospectiveService.findAll(sprintId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RetroCard> {
    return await this.retrospectiveService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRetroCardDto,
  ): Promise<RetroCard> {
    return await this.retrospectiveService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.retrospectiveService.delete(id);
  }
}
