import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RetrospectiveController } from './retrospective.controller';
import { RetrospectiveService } from './retrospective.service';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Module({
  imports: [PrismaModule],
  providers: [RetrospectiveService, EventsGateway],
  controllers: [RetrospectiveController],
})
export class RetrospectiveModule {}
