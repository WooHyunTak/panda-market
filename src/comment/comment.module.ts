import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommonModule } from 'src/common/common.module';
import { CommentRepository } from './comment.repository';
import { PrismaService } from 'src/prismaService';

@Module({
  imports: [CommonModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, PrismaService],
  exports: [CommentService],
})
export class CommentModule {}
