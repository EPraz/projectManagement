import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTicketDto {
  @IsNumber()
  id: number;

  @IsString({ message: 'title must be a string' })
  @IsOptional()
  title: string;

  @IsString({ message: 'statusId must be a string' })
  @IsOptional()
  statusId?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'acceptanceCriteria must be a string' })
  acceptanceCriteria?: string;

  @IsOptional()
  @IsString({ message: 'acceptanceCriteria must be a string' })
  discussion?: string;

  @IsString({ message: 'updatedBy must be a string' })
  @IsNotEmpty({ message: 'updatedBy is required' })
  @IsEmail({}, { message: 'updatedBy Invalid email' })
  updatedBy: string;

  @IsOptional()
  @IsString({ message: 'featureId must be a string' })
  featureId: string;

  @IsOptional()
  @IsString({ message: 'sprintId must be a string' })
  sprintId: string;
}
