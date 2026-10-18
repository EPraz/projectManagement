import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RetroCardType } from '@prisma/client';

export class CreateRetroCardDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(RetroCardType)
  type: RetroCardType;

  // Accepted for already deployed clients; attribution comes from the session.
  @IsOptional()
  @IsString()
  authorId?: string;

  @IsNotEmpty()
  @IsString()
  sprintId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  likedBy?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  likes?: number;
}
