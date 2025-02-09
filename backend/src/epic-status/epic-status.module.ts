import { Module } from '@nestjs/common';
import { EpicStatusController } from './epic-status.controller';
import { EpicStatusService } from './epic-status.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EpicStatusService],
  controllers: [EpicStatusController],
})
export class EpicStatusModule {}
