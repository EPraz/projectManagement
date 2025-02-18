import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  async findAll(
    @Query('featureId') featureId?: string,
    @Query('sprintId') sprintId?: string,
    @Query('ticketStatusId') ticketStatusId?: string
  ): Promise<Ticket[]> {
    if (!featureId && !sprintId && !ticketStatusId) {
      throw new BadRequestException(
        'Either featureId, sprintId, or ticketStatusId is required'
      );
    }
  
    if ((featureId && sprintId) || (featureId && ticketStatusId) || (sprintId && ticketStatusId)) {
      throw new BadRequestException(
        'Only one of featureId, sprintId, or ticketStatusId should be provided'
      );
    }
  
    return await this.ticketService.findAllTickets({ featureId, sprintId, ticketStatusId });
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
