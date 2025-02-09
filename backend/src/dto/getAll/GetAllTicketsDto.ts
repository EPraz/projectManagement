import { IsString, ValidateIf } from 'class-validator';

export class GetAllTicketsDto {
  @ValidateIf((o: GetAllTicketsDto) => !o.sprintId && !o.ticketStatusId) // Si `sprintId o ticketStatusId` no está, `featureId` es requerido
  @IsString({ message: 'featureId must be a string' })
  featureId?: string;

  @ValidateIf((o: GetAllTicketsDto) => !o.featureId && !o.ticketStatusId) // Si `featureId o ticketStatusId` no está, `sprintId` es requerido
  @IsString({ message: 'sprintId must be a string' })
  sprintId?: string;

  @ValidateIf((o: GetAllTicketsDto) => !o.featureId && !o.sprintId) // Si `featureId o sprintId` no está, `ticketStatusId` es requerido
  @IsString({ message: 'sprintId must be a string' })
  ticketStatusId?: string;
}
