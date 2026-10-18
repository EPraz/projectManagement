import { Transform } from 'class-transformer';
import { RetroCardType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateRetroCardDto {
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  content?: string;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsEnum(RetroCardType)
  type?: RetroCardType;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsBoolean()
  liked?: boolean;

  // Older clients send these fields. Identity/parent changes are rejected;
  // reaction intent applies only to the authenticated visitor.
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsString()
  authorId?: string;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsString()
  sprintId?: string;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsArray()
  @IsString({ each: true })
  likedBy?: string[];

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsInt()
  @Min(0)
  likes?: number;
}
