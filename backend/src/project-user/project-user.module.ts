import { Module } from '@nestjs/common';
import { ProjectUserController } from './project-user.controller';

@Module({
  controllers: [ProjectUserController]
})
export class ProjectUserModule {}
