import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString({ message: 'updatedBy must be a string' })
  @IsNotEmpty({ message: 'must provide updatedBy' })
  updatedBy: string;

  id?: string;

  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'must provide title' })
  title: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;
}
