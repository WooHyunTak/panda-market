import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';

import { QueryStringDto } from './dto/queryString.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { TokenPayloadDto } from 'src/common/dto/tokenPayload.dto';
import { CreateProductDto } from './dto/create.product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidationProductPipe } from './pipes/validation.product.pipe';
import { UpdateProductDto } from './dto/update.product.dto';
import { JwtOptionalGuard } from 'src/common/guards/jwt.optional.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(JwtOptionalGuard)
  async getProductList(
    @Query() query: QueryStringDto,
    @User() user: TokenPayloadDto,
  ) {
    let userId = null;
    if (user) {
      userId = user.id;
    }

    const {
      keyword = '',
      orderBy = 'recent',
      pageNumber = 1,
      pageSize = 10,
    } = query;

    const productList = await this.productService.getProductList(
      userId,
      pageNumber,
      pageSize,
      keyword,
      orderBy,
    );

    return productList;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getProductById(@Param('id') id: string, @User() user: TokenPayloadDto) {
    const userId = user.id;
    const product = await this.productService.getProductById(userId, id);
    return product;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Body(ValidationProductPipe) body: CreateProductDto,
    @UploadedFile() image: string[],
    @User() user: TokenPayloadDto,
  ) {
    const userId = user.id;
    return this.productService.createProduct(userId, {
      ...body,
      images: image,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id') id: string,
    @Body(ValidationProductPipe) body: UpdateProductDto,
    @UploadedFile() image: string[],
  ) {
    return this.productService.updateProduct(id, {
      ...body,
      images: image,
    });
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard('jwt'))
  async favoriteProduct(
    @Param('id') id: string,
    @User() user: TokenPayloadDto,
  ) {
    const userId = user.id;
    return this.productService.favoriteProduct(userId, id);
  }

  @Delete(':id/favorite')
  @UseGuards(AuthGuard('jwt'))
  async unfavoriteProduct(
    @Param('id') id: string,
    @User() user: TokenPayloadDto,
  ) {
    const userId = user.id;
    return this.productService.unfavoriteProduct(userId, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
