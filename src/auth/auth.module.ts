import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  providers: [AuthRepository, AuthService, LocalStrategy, JwtStrategy],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'mysecret',
        signOptions: { expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_DURATION') || '3h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule { }
