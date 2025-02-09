import { IsNotEmpty, IsString } from 'class-validator';

export class GetAllFeaturesDto {
  @IsString({ message: 'epicId must be a string' })
  @IsNotEmpty({ message: 'epicId is required' })
  epicId: string;
}
