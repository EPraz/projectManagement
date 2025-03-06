import { GoalStatus } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';

export class UpdateSprintGoalDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(GoalStatus)
  goalsStatus?: GoalStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;
}
