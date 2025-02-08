import { IsNumber, IsString } from 'class-validator';
import { CreateTaskDto } from '../create/CreateTaskDto';

export class UpdateTaskDto extends CreateTaskDto {
  @IsNumber()
  id: number;

  @IsString()
  updatedBy: string;

  @IsString()
  status: string;
}
