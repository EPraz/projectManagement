import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateFeatureDto {
  @IsString({ message: 'epicId must be a string' })
  @IsNotEmpty({ message: 'epicId is required' })
  epicId: string;

  id: string; // Se asignará en el controlador

  @IsString({ message: 'updatedBy must be a string' })
  @IsNotEmpty({ message: 'updatedBy is required' })
  @IsEmail({}, { message: 'updatedBy Invalid email' })
  updatedBy: string;

  @IsString({ message: 'title must be a string' })
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'acceptanceCriteria must be a string' })
  acceptanceCriteria?: string;

  @IsOptional()
  @IsString({ message: 'statusId must be a string' })
  statusId?: string;
}
