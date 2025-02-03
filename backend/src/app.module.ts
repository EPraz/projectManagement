import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { EpicModule } from './epic/epic.module';
import { FeatureModule } from './feature/feature.module';
import { TicketModule } from './ticket/ticket.module';
import { TaskModule } from './task/task.module';
import { ProjectUserService } from './project-user/project-user.service';
import { ProjectUserModule } from './project-user/project-user.module';

@Module({
  imports: [AuthModule, ProjectModule, EpicModule, FeatureModule, TicketModule, TaskModule, ProjectUserModule],
  controllers: [AppController],
  providers: [AppService, ProjectUserService],
})
export class AppModule {}
