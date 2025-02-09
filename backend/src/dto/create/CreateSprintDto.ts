import { Type } from 'class-transformer';
import { IsString, IsDate, IsNotEmpty } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Date) // Convierte el string a Date automáticamente
  @IsDate({ message: 'startDate must be a valid Date' })
  startDate: Date;

  @Type(() => Date) //  Convierte el string a Date automáticamente
  @IsDate({ message: 'endDate must be a valid Date' })
  endDate: Date;
}
