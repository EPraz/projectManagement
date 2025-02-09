import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFeatureDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'acceptanceCriteria must be a string' })
  acceptanceCriteria?: string;

  @IsOptional()
  @IsString({ message: 'discussion must be a string' })
  discussion?: string;

  @IsString({ message: 'createdBy must be a string' })
  @IsNotEmpty({ message: 'createdBy is required' })
  @IsEmail({}, { message: 'createdBy Invalid email' })
  createdBy: string;

  @IsString({ message: 'epicId must be a string' })
  @IsNotEmpty({ message: 'epicId is required' })
  epicId: string;
}
