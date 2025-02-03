import { IsNumber, IsString } from 'class-validator';
import { CreateTicketDto } from '../create';

export class UpdateTicketDto extends CreateTicketDto {
  @IsNumber()
  id: number;

  @IsString()
  updatedBy: string;
}
