import { IsString, IsOptional } from 'class-validator';

export class CreateEpicDto {
  @IsString()
  projectId: string; // Se asignará en el controlador

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  acceptanceCriteria?: string;

  @IsOptional()
  @IsString()
  discussion?: string;

  @IsString()
  createdBy: string;

  @IsString()
  updatedBy: string;
}
