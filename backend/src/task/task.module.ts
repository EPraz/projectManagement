import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Module({
  imports: [PrismaModule],
  providers: [TaskService, EventsGateway],
  controllers: [TaskController],
})
export class TaskModule {}
