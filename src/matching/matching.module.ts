import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { MatchingRepository } from './matching.repository';

@Module({
  controllers: [MatchingController],
  providers: [MatchingService, MatchingRepository],
  exports: [MatchingService],
  imports: [PrismaModule]
})
export class MatchingModule { }
