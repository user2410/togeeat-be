import { BadRequestException, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileService } from './file.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { File } from '@prisma/client';

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'images/gif', 'image/bmp', 'image/x-png'];
const DEFAULT_MAX_IMAGE_SIZE = 1024 * 1024 * 1; // 1MB

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(private service: FileService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const { mimetype, size } = file;

    if(!ALLOWED_IMAGE_MIME_TYPES.includes(mimetype) || size > DEFAULT_MAX_IMAGE_SIZE) {
      throw new BadRequestException({message: 'Invalid file type or size'});
    }

    // console.log(file);
    return await this.service.uploadFile(file.originalname, file.mimetype, file.encoding, file.buffer);
  }

  @Get('image/:fname')
  @UseGuards(JwtAuthGuard)
  async getImage(@Param('id') fname: string, @Res({passthrough: true}) res: Response) {
    const file = await this.service.getFile(fname);
    if (!file) {
      throw new NotFoundException({message: 'File not found'});
    }
    res.set({
      'Content-Disposition': `inline; filename="${file.fileName}"`,
      'Content-Type': file.mimeType,
    })
    return new StreamableFile(file.content);
  }
}
