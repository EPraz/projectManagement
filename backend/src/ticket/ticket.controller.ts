import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { CreateTicketDto, UpdateTicketDto } from 'src/dto';
import { TicketService } from './ticket.service';

@Controller('features/:featureId/tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async create(
    @Param('featureId') featureId: string,
    @Body() newTicket: CreateTicketDto,
  ): Promise<Ticket> {
    return await this.ticketService.create({ ...newTicket, featureId });
  }

  @Get()
  async findAll(@Param('featureId') featureId: string): Promise<Ticket[]> {
    return await this.ticketService.findAllByFeature(featureId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Ticket | null> {
    return await this.ticketService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    request: UpdateTicketDto,
  ): Promise<Ticket> {
    return await this.ticketService.update({ ...request, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Ticket> {
    return await this.ticketService.delete(id);
  }
}
