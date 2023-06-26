import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { MatchingModule } from './matching/matching.module';
import { ChatModule } from './chat/chat.module';
import { ReviewController } from './review/review.controller';
import { ReviewModule } from './review/review.module';
import { UsersModule } from './users/users.module';
import { CustomJwtModule } from './auth/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ScheduleModule.forRoot(),
    MatchingModule,
    UsersModule,
    AuthModule,
    ReviewModule,
    FileModule,
    ChatModule,
    CustomJwtModule,
  ],
  controllers: [AppController, ReviewController],
  providers: [AppService],
})
export class AppModule { }
