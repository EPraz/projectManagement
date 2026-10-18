import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { TicketType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { UpdateTicketDto } from '../dto';

export class BulkUpdateTicketDto extends OmitType(UpdateTicketDto, [
  'id',
  'updatedBy',
  'title',
  'type',
  'isBlocked',
  'tags',
  'blockedBy',
  'storyPoints',
] as const) {
  @IsInt()
  @Min(1)
  @Max(2147483647)
  id: number;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  order?: number;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsEnum(TicketType)
  type?: TicketType;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsBoolean()
  isBlocked?: boolean;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2147483647)
  blockedBy?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2147483647)
  storyPoints?: number | null;

  // Already deployed callers may send this; the server stamps the actor.
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
