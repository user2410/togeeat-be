import { separateFilenameAndExtension } from '@/common/utils/filename';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { File } from '@prisma/client';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async uploadFile(originalName: string, mimeType: string, encoding: string, file: Buffer)  {
    const { fileName, fileExt } = separateFilenameAndExtension(originalName);
    return await this.prisma.file.create({
      data: {
        fileName: `${fileName ? fileName : 'file'}_${Date.now()}.${fileExt ? fileExt : ''}`,
        mimeType,
        encoding,
        content: file,
      },
      select: {
        fileName: true,
        mimeType: true,
        createdAt: true,
      }
    });
  }

  async getFile(fileName: string) : Promise<File | null> {
    return await this.prisma.file.findFirst({
      where: { fileName },
    });
  }
}
