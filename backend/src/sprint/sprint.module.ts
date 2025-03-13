import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Module({
  imports: [PrismaModule],
  providers: [SprintService, EventsGateway],
  controllers: [SprintController],
})
export class SprintModule {}
