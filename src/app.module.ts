import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchingModule } from './matching/matching.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReviewController } from './review/review.controller';
import { ReviewModule } from './review/review.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MatchingModule,
    UsersModule,
    AuthModule,
    ReviewModule,
    FileModule
  ],
  controllers: [AppController, ReviewController],
  providers: [AppService],
})
export class AppModule { }
