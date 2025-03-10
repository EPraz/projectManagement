import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RetrospectiveController } from './retrospective.controller';
import { RetrospectiveService } from './retrospective.service';

@Module({
  imports: [PrismaModule],
  providers: [RetrospectiveService],
  controllers: [RetrospectiveController],
})
export class RetrospectiveModule {}
