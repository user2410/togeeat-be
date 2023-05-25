import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
  imports: [PrismaModule]
})
export class MatchingModule { }
