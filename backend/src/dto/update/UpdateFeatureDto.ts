import { IsString } from 'class-validator';
import { CreateFeatureDto } from '../create';

export class UpdateFeatureDto extends CreateFeatureDto {
  @IsString()
  id: string;

  @IsString()
  updatedBy: string;
}
