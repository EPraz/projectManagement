import { IsString } from 'class-validator';
import { CreateProjectDto } from '../create';

export class UpdateProjectDto extends CreateProjectDto {
  @IsString()
  updatedBy: string;

  @IsString()
  id: string;
}
