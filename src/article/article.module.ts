import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleRepository } from './article.repository';
import { PrismaService } from 'src/prismaService';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository, PrismaService],
  exports: [ArticleService],
})
export class ArticleModule {}
