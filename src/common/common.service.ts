import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { S3_CLIENT } from './providers/s3.client.provider';

@Injectable()
export class CommonService {
  constructor(@Inject(S3_CLIENT) private readonly s3: S3Client) {}

  async uploadFile(files: Express.Multer.File[], optional: boolean = false) {
    if (!files || files.length === 0) {
      if (optional) {
        return [];
      }
      throw new BadRequestException('No files uploaded');
    }

    const uploadPromises = files.map(async (file) => {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3.send(command);
      return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/${file.originalname}`;
    });

    return await Promise.all(uploadPromises);
  }
}
