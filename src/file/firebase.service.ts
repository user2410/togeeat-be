import { Injectable, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";
import { ConfigService } from "@nestjs/config";
import { Bucket } from "@google-cloud/storage";

@Injectable()
export class FirebaseService implements OnModuleInit {
  private bucket: Bucket;

  constructor(private configService: ConfigService) { }

  async onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY')
      }),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET')
    });
    this.bucket = admin.storage().bucket();
  }

  handleFileUpload(fileName: string, contentType: string, buffer: Buffer) {
    return new Promise<string>((resolve, reject) => {
      const file = this.bucket.file(fileName);
      const writeStream = file.createWriteStream({
        metadata: { contentType }
      });
      writeStream.end(buffer);
      writeStream
        .on('error', (error) => reject(error))
        .on('finish', () => {
          file.getSignedUrl({
            action: 'read',
            expires: Date.now() + (1000 * 60 * 60 * 24 * 365)
          }).then(url => resolve(url[0]))
            .catch(error => reject(error));
        });
    });
  }
}