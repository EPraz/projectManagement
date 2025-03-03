import { TicketPriority, TicketType } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateTicketDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'acceptanceCriteria must be a string' })
  acceptanceCriteria?: string;

  @IsOptional()
  @IsString({ message: 'discussion must be a string' })
  discussion?: string;

  @IsString({ message: 'createdBy must be a string' })
  @IsNotEmpty({ message: 'createdBy is required' })
  @IsEmail({}, { message: 'createdBy Invalid email' })
  createdBy: string;

  @IsOptional()
  @IsString({ message: 'featureId must be a string' })
  featureId?: string;

  @IsOptional()
  @IsString({ message: 'sprintId must be a string' })
  sprintId?: string;

  @IsEnum(TicketPriority, { message: 'priority must be a valid enum value' })
  @IsOptional()
  priority?: TicketPriority;

  @IsArray()
  @IsOptional()
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];

  @IsString({ message: 'assignedTo must be a string' })
  @IsOptional()
  assignedTo?: string;

  @IsNumber({}, { message: 'estimatedHours must be a number' })
  @IsOptional()
  estimatedHours?: number;

  @IsNumber({}, { message: 'remainingHours must be a number' })
  @IsOptional()
  remainingHours?: number;

  @IsNumber({}, { message: 'completedHours must be a number' })
  @IsOptional()
  completedHours?: number;

  @IsNumber({}, { message: 'storyPoints must be a number' })
  @IsOptional()
  storyPoints?: number;

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

  @IsOptional()
  @IsString({ message: 'additionalDetails must be a string' })
  additionalDetails?: string;

  @IsOptional()
  @IsString({ message: 'notes must be a string' })
  notes?: string;

  @IsOptional()
  @IsString({ message: 'designInformation must be a string' })
  designInformation?: string;
}
