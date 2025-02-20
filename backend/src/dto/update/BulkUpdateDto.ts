// bulk-update-tickets.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UpdateTicketDto } from './UpdateTicketDto';

export class BulkUpdateTicketsDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateTicketDto)
  tickets: UpdateTicketDto[];
}
