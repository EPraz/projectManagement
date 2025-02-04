import { Module } from '@nestjs/common';
import { EpicService } from './epic.service';
import { EpicController } from './epic.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EpicService],
  controllers: [EpicController],
})
export class EpicModule {}
