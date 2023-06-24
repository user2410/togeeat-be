import { separateFilenameAndExtension } from '@/common/utils/filename';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { File } from '@prisma/client';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async uploadFile(originalName: string, mimeType: string, encoding: string, file: Buffer) : Promise<File> {
    const { fileName, fileExt } = separateFilenameAndExtension(originalName);
    return await this.prisma.file.create({
      data: {
        fileName: fileName ? fileName : 'file',
        fileExt: fileExt ? fileExt : '',
        mimeType,
        encoding,
        content: file,
      }
    });
  }

  async getFile(id: number) : Promise<File | null> {
    return await this.prisma.file.findUnique({
      where: { id },
    });
  }
}
