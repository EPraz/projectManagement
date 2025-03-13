import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SprintGoalService } from './sprint-goal.service';
import { SprintGoalController } from './sprint-goal.controller';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Module({
  imports: [PrismaModule],
  providers: [SprintGoalService, EventsGateway],
  controllers: [SprintGoalController],
})
export class SprintGoalModule {}
