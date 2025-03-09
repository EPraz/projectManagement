import { IsString, IsInt } from 'class-validator';

export class CreateTeamMemberCapacityDto {
  @IsString()
  userId: string;

  @IsString()
  sprintId: string;

  @IsInt()
  capacity: number; // Total de horas disponibles para el sprint

  @IsInt()
  daysOff: number; // Número de días libres en el sprint

  @IsInt()
  remainingWork: number; // Horas de trabajo pendientes
}
