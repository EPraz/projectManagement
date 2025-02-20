import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  // statusId?: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'acceptanceCriteria must be a string' })
  acceptanceCriteria?: string;

  @IsOptional()
  @IsString({ message: 'acceptanceCriteria must be a string' })
  discussion?: string;

  @IsString({ message: 'createdBy must be a string' })
  @IsNotEmpty({ message: 'createdBy is required' })
  @IsEmail({}, { message: 'createdBy Invalid email' })
  createdBy: string;

  @IsOptional()
  @IsString({ message: 'featureId must be a string' })
  featureId: string;

  @IsOptional()
  @IsString({ message: 'sprintId must be a string' })
  sprintId: string;
}
