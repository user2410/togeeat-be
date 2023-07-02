import { separateFilenameAndExtension } from '@/common/utils/filename';
import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FileService {
  constructor(
    private firebaseService: FirebaseService,
  ) {}

  async uploadFile(originalName: string, mimeType: string, file: Buffer)  {
    // preprocess original file name: add timestamp to end of file name
    const {fileName, fileExt} = separateFilenameAndExtension(originalName);
    const newFilename = `${fileName ? fileName : 'file'}-${Date.now()}.${fileExt ? fileExt : ''}`;
    
    return await this.firebaseService.handleFileUpload(newFilename, mimeType, file);
  }
}
