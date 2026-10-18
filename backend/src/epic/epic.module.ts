import { Module } from '@nestjs/common';
import { EpicService } from './epic.service';
import { EpicController } from './epic.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsGateway } from '../webSockets/events.gateway';

@Module({
  imports: [PrismaModule],
  providers: [EpicService, EventsGateway],
  controllers: [EpicController],
})
export class EpicModule {}
