import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { RetrospectiveService } from './retrospective.service';
import { CreateRetroCardDto, UpdateRetroCardDto } from 'src/dto';
import { RetrospectiveQueryDto } from './retrospective-query.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

type AuthenticatedRequest = Request & { user: { id: string } };

@UseGuards(JwtAuthGuard)
@Controller('retrospectives')
export class RetrospectiveController {
  constructor(private readonly retrospectiveService: RetrospectiveService) {}

  @Post()
  async create(
    @Body() data: CreateRetroCardDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.retrospectiveService.create(data, req.user.id);
  }

  @Get()
  async findAll(@Query() query: RetrospectiveQueryDto) {
    return await this.retrospectiveService.findAll(query.sprintId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.retrospectiveService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateRetroCardDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.retrospectiveService.update(id, data, req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.retrospectiveService.delete(id);
  }
}
