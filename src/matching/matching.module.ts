import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { MatchingRepository } from './matching.repository';

@Module({
  controllers: [MatchingController],
  imports: [PrismaModule],
  providers: [MatchingRepository, MatchingService],
  exports: [MatchingService],
})
export class MatchingModule { }
