import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString({ message: 'updatedBy must be a string' })
  @IsNotEmpty({ message: 'updatedBy is required' })
  @IsEmail({}, { message: 'updatedBy Invalid email' })
  updatedBy: string;

  id: string; // Se asignará en el controlador

  @IsString({ message: 'title must be a string' })
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;
}
