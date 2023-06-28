import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { BadRequestException, Controller, Get, NotFoundException, Param, Post, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FileService } from './file.service';
import { ConfigService } from '@nestjs/config';

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(
    private configService: ConfigService,
    private service: FileService
  ) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image')) 
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
    
    const { mimetype, size } = file;
    const ALLOWED_IMAGE_MIME_TYPES = this.configService.get<string>('ALLOWED_IMAGE_MIME_TYPES', 'image/jpeg,image/png,images/gif,image/bmp,image/webp,image/svg+xml');
    const DEFAULT_MAX_IMAGE_SIZE = this.configService.get<number>('DEFAULT_MAX_IMAGE_SIZE', 1024 * 1024 * 5); // 5MB
    
    if(!ALLOWED_IMAGE_MIME_TYPES.includes(mimetype) || size > DEFAULT_MAX_IMAGE_SIZE) {
      throw new BadRequestException({message: 'Invalid file type or size'});
    }

    return {
      url: await this.service.uploadFile(file.originalname, file.mimetype, file.buffer)
    };
  }
}
