import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { CreateTicketDto, UpdateTicketDto } from 'src/dto';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
    @Query('ticketStatusId') ticketStatusId?: string,
  ): Promise<Ticket[]> {
    if (!featureId && !sprintId && !ticketStatusId) {
      throw new BadRequestException(
        'Either featureId, sprintId, or ticketStatusId is required',
      );
    }

    if (
      (featureId && sprintId) ||
      (featureId && ticketStatusId) ||
      (sprintId && ticketStatusId)
    ) {
      throw new BadRequestException(
        'Only one of featureId, sprintId, or ticketStatusId should be provided',
      );
    }

    return await this.ticketService.findAllTickets({
      featureId,
      sprintId,
      ticketStatusId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Ticket | null> {
    return await this.ticketService.findOne(id);
  }

  @Patch('bulk-update')
  async bulkUpdate(@Body() request: UpdateTicketDto[]): Promise<Ticket[]> {
    return await this.ticketService.bulkUpdate(request);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() request: UpdateTicketDto,
  ): Promise<Ticket | null> {
    return await this.ticketService.update({ ...request, id });
  }

  @Delete('all')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content
  async deleteAll(): Promise<void> {
    await this.ticketService.deleteAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return await this.ticketService.delete(id);
  }
}
