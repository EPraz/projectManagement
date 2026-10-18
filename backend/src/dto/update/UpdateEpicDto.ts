import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateEpicDto {
  @IsString({ message: 'projectId must be a string' })
  @IsNotEmpty({ message: 'projectId is required' })
  projectId: string;

  id: string; // Se asignará en el controlador

  @IsString({ message: 'updatedBy must be a string' })
  @IsNotEmpty({ message: 'updatedBy is required' })
  @IsEmail({}, { message: 'updatedBy Invalid email' })
  updatedBy: string;

  @IsString({ message: 'title must be a string' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'acceptanceCriteria must be a string' })
  acceptanceCriteria?: string;

  @IsOptional()
  @IsString()
  statusId?: string;
}
