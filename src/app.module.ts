import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchingModule } from './matching/matching.module';

@Module({
  imports: [ConfigModule.forRoot(), MatchingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
