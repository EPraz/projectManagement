import { IsString, IsDate } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  projectId: string;

  @IsString()
  name: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}
