import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prismaService';
import { CommonService } from './common.service';

@Module({
  providers: [CommonService, PrismaService],
  exports: [CommonService, PrismaService],
})
export class CommonModule {}
