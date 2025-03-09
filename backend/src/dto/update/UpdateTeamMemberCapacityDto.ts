import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamMemberCapacityDto } from '../create';

export class UpdateTeamMemberCapacityDto extends PartialType(
  CreateTeamMemberCapacityDto,
) {}
