import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { EpicModule } from './epic/epic.module';
import { FeatureModule } from './feature/feature.module';
import { TicketModule } from './ticket/ticket.module';
import { TaskModule } from './task/task.module';
import { SprintModule } from './sprint/sprint.module';
import { EpicStatusModule } from './epic-status/epic-status.module';
import { SprintGoalModule } from './sprint-goal/sprint-goal.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    ProjectModule,
    EpicModule,
    FeatureModule,
    TicketModule,
    TaskModule,
    SprintModule,
    EpicStatusModule,
    SprintGoalModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
