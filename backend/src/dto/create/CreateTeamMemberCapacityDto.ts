import { IsString, IsInt, IsNotEmpty, Min, Max } from 'class-validator';
export class CreateTeamMemberCapacityDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  sprintId: string;
  @IsInt()
  @Max(2147483647)
  @Min(1)
  capacity: number;
  @IsInt()
  @Max(2147483647)
  @Min(0)
  daysOff: number;
  @IsInt()
  @Max(2147483647)
  @Min(0)
  remainingWork: number;
}
