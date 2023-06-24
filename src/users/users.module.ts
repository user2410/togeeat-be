import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from '@/auth/auth.repository';
import { AuthService } from '@/auth/auth.service';

@Module({
  controllers: [UsersController],
  imports: [PrismaModule, PassportModule],
  providers: [UsersRepository, UsersService, AuthRepository, AuthService, JwtService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule { }
