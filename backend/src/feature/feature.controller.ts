import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { FeatureService } from './feature.service';
import { CreateFeatureDto, GetAllFeaturesDto, UpdateFeatureDto } from 'src/dto';
import { Feature } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('features')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  async create(@Body() request: CreateFeatureDto): Promise<Feature> {
    return await this.featureService.create(request);
  }

  @Get()
  async findAll(@Body() request: GetAllFeaturesDto): Promise<Feature[]> {
    return await this.featureService.findAllByEpic(request.epicId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Feature | null> {
    return await this.featureService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateFeatureDto,
  ): Promise<Feature> {
    return await this.featureService.update({ ...request, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.featureService.delete(id);
  }
}
