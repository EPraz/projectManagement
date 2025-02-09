import { IsString, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSprintDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate: Date;

  id: string; // se agrega en el controller
}
