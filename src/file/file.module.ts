import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CustomJwtModule } from '@/auth/jwt.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [FileController],
  imports: [PrismaModule, CustomJwtModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
