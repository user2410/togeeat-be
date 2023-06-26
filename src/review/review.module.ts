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
import { CustomJwtModule } from '@/auth/jwt.module';

@Module({
  controllers: [ReviewController],
  imports: [PrismaModule, PassportModule, CustomJwtModule],
  providers: [ReviewRepository, ReviewService],
  exports: [ReviewService]
})
export class ReviewModule {}
