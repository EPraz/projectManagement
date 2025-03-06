import { IsString } from 'class-validator';

export class CreateGoalTaskDto {
  @IsString()
  goalId: string;

  @IsString()
  title: string;
}
