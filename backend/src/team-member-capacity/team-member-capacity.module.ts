import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TeamMemberCapacityService } from './team-member-capacity.service';
import { TeamMemberCapacityController } from './team-member-capacity.controller';
import { EventsGateway } from 'src/webSockets/events.gateway';

@Module({
  imports: [PrismaModule],
  providers: [TeamMemberCapacityService, EventsGateway],
  controllers: [TeamMemberCapacityController],
})
export class TeamMemberCapacityModule {}
