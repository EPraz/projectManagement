import { IsIn, IsOptional } from 'class-validator';

export class ProjectListQueryDto {
  @IsOptional()
  @IsIn(['full', 'summary'])
  view?: 'full' | 'summary';
}
export class ProjectDetailQueryDto {
  @IsOptional()
  @IsIn(['full', 'workspace'])
  view?: 'full' | 'workspace';
}
