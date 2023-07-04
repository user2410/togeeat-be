import { CustomJwtModule } from '@/auth/jwt.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MatchingController } from './matching.controller';
import { MatchingRepository } from './matching.repository';
import { MatchingService } from './matching.service';
import { ChatService } from '@/chat/chat.service';
import { ChatRepository } from '@/chat/chat.repository';

@Module({
  controllers: [MatchingController],
  imports: [PrismaModule, PassportModule, CustomJwtModule],
  providers: [MatchingRepository, MatchingService, ChatRepository, ChatService],
  exports: [MatchingService],
})
export class MatchingModule { }
