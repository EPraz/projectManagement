import { IsInt, Min, Max, ValidateIf } from 'class-validator';
export class UpdateTeamMemberCapacityDto {
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsInt()
  @Max(2147483647)
  @Min(1)
  capacity?: number;
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsInt()
  @Max(2147483647)
  @Min(0)
  daysOff?: number;
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsInt()
  @Max(2147483647)
  @Min(0)
  remainingWork?: number;
}
