import { BadRequestException, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Res, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileService } from './file.service';

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'images/gif', 'image/bmp', 'image/x-png'];
const DEFAULT_MAX_IMAGE_SIZE = 1024 * 1024 * 1; // 1MB

@Controller('file')
export class FileController {
  constructor(private service: FileService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const { mimetype, size } = file;

    if(!ALLOWED_IMAGE_MIME_TYPES.includes(mimetype) || size > DEFAULT_MAX_IMAGE_SIZE) {
      throw new BadRequestException({message: 'Invalid file type or size'});
    }

    // console.log(file);
    await this.service.uploadFile(file.originalname, file.mimetype, file.encoding, file.buffer);
  }

  @Get('image/:id')
  async getImage(@Param('id', ParseIntPipe) id: number, @Res({passthrough: true}) res: Response) {
    const file = await this.service.getFile(id);
    if (!file) {
      throw new NotFoundException({message: 'File not found'});
    }
    res.set({
      'Content-Disposition': `inline; filename="${file.fileName}.${file.fileExt}"`,
      'Content-Type': file.mimeType,
    })
    return new StreamableFile(file.content);
  }
}
