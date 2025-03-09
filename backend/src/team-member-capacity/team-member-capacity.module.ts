import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TeamMemberCapacityService } from './team-member-capacity.service';
import { TeamMemberCapacityController } from './team-member-capacity.controller';

@Module({
  imports: [PrismaModule],
  providers: [TeamMemberCapacityService],
  controllers: [TeamMemberCapacityController],
})
export class TeamMemberCapacityModule {}
