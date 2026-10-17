import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
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
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';
import { PublicDataInterceptor } from './public-data.interceptor';
import { validateEnvironment } from './environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'test',
      validate: validateEnvironment,
    }),
    PrismaModule,
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
  controllers: [HealthController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: PublicDataInterceptor }],
})
export class AppModule {}
