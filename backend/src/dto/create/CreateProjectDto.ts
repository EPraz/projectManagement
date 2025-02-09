import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsString({ message: 'createdBy must be a string' })
  @IsEmail({}, { message: 'createdBy Invalid email' })
  @IsNotEmpty({ message: 'createdBy is required' })
  createdBy: string;
}
