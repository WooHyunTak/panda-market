import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prismaService';
import { CommonService } from './common.service';
import { s3ClientProvider } from './providers/s3.client.provider';

@Module({
  providers: [CommonService, PrismaService, s3ClientProvider],
  exports: [CommonService, PrismaService, s3ClientProvider],
})
export class CommonModule {}
