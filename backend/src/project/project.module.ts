import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Module({
  imports: [PrismaModule],
  providers: [ProjectService, EventsGateway],
  controllers: [ProjectController],
})
export class ProjectModule {}
