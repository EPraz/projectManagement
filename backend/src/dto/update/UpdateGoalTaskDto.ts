import { IsOptional, IsString } from 'class-validator';

export class UpdateGoalTaskDto {
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  completed?: boolean;
}
