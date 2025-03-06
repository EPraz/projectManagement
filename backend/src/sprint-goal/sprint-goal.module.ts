import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SprintGoalService } from './sprint-goal.service';
import { SprintGoalController } from './sprint-goal.controller';

@Module({
  imports: [PrismaModule],
  providers: [SprintGoalService],
  controllers: [SprintGoalController],
})
export class SprintGoalModule {}
