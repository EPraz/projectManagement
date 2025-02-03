import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { FeatureService } from './feature.service';
import { CreateFeatureDto, UpdateFeatureDto } from 'src/dto';

@Controller('epics/:epicId/features')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  async create(
    @Param('epicId') epicId: string,
    @Body() request: CreateFeatureDto,
  ) {
    return await this.featureService.create({ ...request, epicId });
  }

  @Get()
  async findAll(@Param('epicId') epicId: string) {
    return await this.featureService.findAllByEpic(epicId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.featureService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, request: UpdateFeatureDto) {
    return await this.featureService.update({ ...request, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.featureService.delete(id);
  }
}
