import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetAllTasksDto {
  @IsNumber()
  @IsNotEmpty({ message: 'ticketId is required' })
  ticketId: number;
}
