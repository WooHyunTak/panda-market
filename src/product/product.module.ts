import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prismaService';
import { ProductRepository } from './product.repository';

@Module({
  imports: [CommonModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, PrismaService],
  exports: [ProductService],
})
export class ProductModule {}
