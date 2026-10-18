import { IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

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
  @Matches(/\S/, { message: 'title must not be blank' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  discussion?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  remainingHours?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  completedHours?: number | null;
}
