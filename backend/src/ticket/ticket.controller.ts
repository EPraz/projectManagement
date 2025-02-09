import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { CreateTicketDto, GetAllTicketsDto, UpdateTicketDto } from 'src/dto';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async create(@Body() newTicket: CreateTicketDto): Promise<Ticket | null> {
    return await this.ticketService.create(newTicket);
  }

  @Get()
  async findAll(@Body() request: GetAllTicketsDto): Promise<Ticket[]> {
    if (!request.featureId && !request.sprintId && !request.ticketStatusId) {
      throw new BadRequestException('Either featureId or sprintId is required');
    }
    if (request.featureId && request.sprintId && request.ticketStatusId) {
      throw new BadRequestException(
        'Either featureId or sprintId, not both of them',
      );
    }

    return await this.ticketService.findAllTickets(request);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Ticket | null> {
    return await this.ticketService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    request: UpdateTicketDto,
  ): Promise<Ticket | null> {
    return await this.ticketService.update({ ...request, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return await this.ticketService.delete(id);
  }
}
