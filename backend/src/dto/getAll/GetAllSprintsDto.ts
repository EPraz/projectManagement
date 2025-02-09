import { IsNotEmpty, IsString } from 'class-validator';

export class GetAllSprintsDto {
  @IsString({ message: 'projectId must be a string' })
  @IsNotEmpty({ message: 'projectId is required' })
  projectId: string;
}
