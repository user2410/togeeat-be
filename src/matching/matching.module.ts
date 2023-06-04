import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { MatchingRepository } from './matching.repository';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@/auth/auth.service';
import { AuthRepository } from '@/auth/auth.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MatchingController],
  imports: [PrismaModule, PassportModule],
  providers: [MatchingRepository, AuthRepository, MatchingService, AuthService, JwtService, JwtStrategy],
  exports: [MatchingService],
})
export class MatchingModule { }
