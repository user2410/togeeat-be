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
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(8080),
        DATABASE_URL: Joi.string().uri().required(),

        JWT_SECRET: Joi.string().default('mysecret'),
        JWT_ACCESS_TOKEN_DURATION: Joi.string().default('3h'),
        
        ALLOWED_IMAGE_MIME_TYPES: Joi.string().default('image/jpeg,image/png,images/gif,image/bmp,image/webp,image/svg+xml'),
        DEFAULT_MAX_IMAGE_SIZE: Joi.number().default(5242880), // 5MB

        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_CLIENT_EMAIL: Joi.string().email().required(),
        FIREBASE_PRIVATE_KEY: Joi.string().required(),
        FIREBASE_STORAGE_BUCKET: Joi.string().required(),
      })
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
