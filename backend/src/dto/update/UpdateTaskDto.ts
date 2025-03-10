import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsNumber()
  id: number;

  @IsString()
  updatedBy: string;

  @IsOptional()
  @IsString()
  statusId: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
