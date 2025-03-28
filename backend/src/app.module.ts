import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
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
import { TeamMemberCapacityModule } from './team-member-capacity/team-member-capacity.module';
import { RetrospectiveModule } from './retrospective/retrospective.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Serve frontend estático
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      rootPath: join(__dirname, '..', 'client'),
      // Puedes excluir rutas si tus endpoints comienzan con /api
      // exclude: ['/api*'],
    }),

    // Tu app Nest
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
    TeamMemberCapacityModule,
    RetrospectiveModule,
  ],
  // controllers: [AppController],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
