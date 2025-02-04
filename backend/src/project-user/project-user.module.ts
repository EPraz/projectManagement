import { Module } from '@nestjs/common';
import { ProjectUserController } from './project-user.controller';
import { ProjectUserService } from './project-user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectUserController],
  providers: [ProjectUserService],
  exports: [ProjectUserService],
})
export class ProjectUserModule {}
