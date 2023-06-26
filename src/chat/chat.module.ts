import { CustomJwtModule } from '@/auth/jwt.module';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [PrismaModule, CustomJwtModule],
  providers: [ChatRepository, ChatGateway, ChatService],
  controllers: [ChatController]
})
export class ChatModule { }
