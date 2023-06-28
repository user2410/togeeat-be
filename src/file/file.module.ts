import { CustomJwtModule } from '@/auth/jwt.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FirebaseModule } from './firebase.module';

@Module({
  controllers: [FileController],
  imports: [CustomJwtModule, ConfigModule, FirebaseModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
