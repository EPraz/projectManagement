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

  @IsOptional()
  @IsString()
  discussion?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsNumber()
  estimatedHours: number;

  @IsOptional()
  @IsNumber()
  remainingHours: number;

  @IsOptional()
  @IsNumber()
  completedHours: number;
}
