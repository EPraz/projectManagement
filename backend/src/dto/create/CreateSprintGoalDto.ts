import { IsString, IsOptional } from 'class-validator';

export class CreateSprintGoalDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  sprintId: string;
}
