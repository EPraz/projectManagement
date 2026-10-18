import { Transform } from 'class-transformer';
import { IsString, IsBoolean, ValidateIf, IsNotEmpty } from 'class-validator';

export class UpdateGoalTaskDto {
  @IsString()
  id?: string;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsBoolean()
  completed?: boolean;
}
