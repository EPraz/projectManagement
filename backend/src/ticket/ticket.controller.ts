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
  Req,
  UseGuards,
} from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { CreateTicketDto, UpdateTicketDto } from 'src/dto';
import { TicketIdDto } from './ticket-id.dto';
import { BulkUpdateTicketDto } from './bulk-update-ticket.dto';
import { BulkTicketUpdatesPipe } from './bulk-ticket-updates.pipe';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

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
  async findOne(@Param() params: TicketIdDto): Promise<Ticket | null> {
    return await this.ticketService.findOne(params.id);
  }

  @Patch('bulk-update')
  async bulkUpdate(
    @Body(BulkTicketUpdatesPipe) request: BulkUpdateTicketDto[],
    @Req() authenticatedRequest: Request & { user: { email: string } },
  ): Promise<Ticket[]> {
    return await this.ticketService.bulkUpdate(
      request,
      authenticatedRequest.user.email,
    );
  }

  @Patch(':id')
  async update(
    @Param() params: TicketIdDto,
    @Body() request: UpdateTicketDto,
    @Req() authenticatedRequest: Request & { user: { email: string } },
  ): Promise<Ticket | null> {
    return await this.ticketService.update({
      ...request,
      id: params.id,
      updatedBy: authenticatedRequest.user.email,
    });
  }

  @Delete(':id')
  async delete(@Param() params: TicketIdDto): Promise<boolean> {
    return await this.ticketService.delete(params.id);
  }
}
