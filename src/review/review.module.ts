import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { ReviewRepository } from './review.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { AuthRepository } from '@/auth/auth.repository';
import { AuthService } from '@/auth/auth.service';

@Module({
  controllers: [ReviewController],
  imports: [PrismaModule, PassportModule],
  providers: [ReviewRepository, ReviewService, AuthRepository, AuthService, JwtService, JwtStrategy],
  exports: [ReviewService]
})
export class ReviewModule {}
