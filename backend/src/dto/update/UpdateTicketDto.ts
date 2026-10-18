import { TicketPriority, TicketType } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  Matches,
  Min,
} from 'class-validator';

export class UpdateTicketDto {
  @IsNumber()
  id: number;

  @IsString({ message: 'title must be a string' })
  @IsOptional()
  @Matches(/\S/, { message: 'title must not be blank' })
  title?: string;

  @IsString({ message: 'statusId must be a string' })
  @IsOptional()
  statusId?: string;

  @IsString({ message: 'sprintId must be a string' })
  @IsOptional()
  sprintId?: string | null;

  @IsString()
  @IsOptional()
  featureId?: string | null;

  @IsString({ message: 'description must be a string' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'additionalDetails must be a string' })
  @IsOptional()
  additionalDetails?: string;

  @IsString({ message: 'acceptanceCriteria must be a string' })
  @IsOptional()
  acceptanceCriteria?: string;

  @IsString({ message: 'designInformation must be a string' })
  @IsOptional()
  designInformation?: string;

  @IsString({ message: 'notes must be a string' })
  @IsOptional()
  notes?: string;

  @IsEnum(TicketPriority, { message: 'priority must be a valid enum value' })
  @IsOptional()
  priority?: TicketPriority;

  @IsArray()
  @IsOptional()
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];

  @IsString({ message: 'assignedTo must be a string' })
  @IsOptional()
  assignedTo?: string | null;

  @IsNumber({}, { message: 'estimatedHours must be a number' })
  @IsOptional()
  @Min(0)
  estimatedHours?: number | null;

  @IsNumber({}, { message: 'remainingHours must be a number' })
  @IsOptional()
  @Min(0)
  remainingHours?: number | null;

  @IsNumber({}, { message: 'completedHours must be a number' })
  @IsOptional()
  @Min(0)
  completedHours?: number | null;

  @IsNumber({}, { message: 'storyPoints must be a number' })
  @IsOptional()
  @IsInt()
  @Min(0)
  storyPoints?: number | null;

  @IsDateString({}, { message: 'dueDate must be a valid ISO date string' })
  @IsOptional()
  dueDate?: string;

  @IsBoolean({ message: 'isBlocked must be a boolean' })
  @IsOptional()
  isBlocked?: boolean;

  @IsNumber({}, { message: 'blockedBy must be a number' })
  @IsOptional()
  blockedBy?: number;

  @IsEnum(TicketType, { message: 'type must be a valid enum value' })
  @IsOptional()
  type?: TicketType;

  @IsString({ message: 'updatedBy must be a string' })
  @IsNotEmpty({ message: 'updatedBy is required' })
  @IsEmail({}, { message: 'updatedBy Invalid email' })
  updatedBy: string;

  @IsString({ message: 'discussion must be a string' })
  @IsOptional()
  discussion?: string;
}
