import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RetroCardType } from '@prisma/client';

export class CreateRetroCardDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(RetroCardType, {
    message: 'Type must be either POSITIVE or NEGATIVE',
  })
  type: RetroCardType;

  @IsNotEmpty()
  @IsString()
  authorId: string;

  @IsNotEmpty()
  @IsString()
  sprintId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Validación para cada elemento del array
  likedBy: string[];

  @IsOptional()
  @IsNumber()
  likes: number;
}
