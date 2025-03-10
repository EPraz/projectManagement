import { PartialType } from '@nestjs/mapped-types';
import { CreateRetroCardDto } from '../create';

export class UpdateRetroCardDto extends PartialType(CreateRetroCardDto) {}
