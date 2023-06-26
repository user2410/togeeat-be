import { CustomJwtModule } from '@/auth/jwt.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [PrismaModule, PassportModule, CustomJwtModule],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule { }
