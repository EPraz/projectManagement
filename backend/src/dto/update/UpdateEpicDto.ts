import { IsString } from 'class-validator';
import { CreateEpicDto } from '../create';

export class UpdateEpicDto extends CreateEpicDto {
  @IsString()
  id: string;

  @IsString()
  updatedBy: string;
}
