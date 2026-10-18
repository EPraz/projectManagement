import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsGateway } from '../webSockets/events.gateway';

@Module({
  imports: [PrismaModule],
  providers: [FeatureService, EventsGateway],
  controllers: [FeatureController],
})
export class FeatureModule {}
