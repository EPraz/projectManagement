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
} from 'class-validator';

export class UpdateTicketDto {
  @IsNumber()
  id: number;

  @IsString({ message: 'title must be a string' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'statusId must be a string' })
  @IsOptional()
  statusId?: string;

  @IsString({ message: 'sprintId must be a string' })
  @IsOptional()
  sprintId?: string;

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

  @IsString({ message: 'updatedBy must be a string' })
  @IsNotEmpty({ message: 'updatedBy is required' })
  @IsEmail({}, { message: 'updatedBy Invalid email' })
  updatedBy: string;

  @IsString({ message: 'discussion must be a string' })
  @IsOptional()
  discussion?: string;
}
