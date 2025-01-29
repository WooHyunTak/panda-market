import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { QueryStringDto } from './dto/queryString.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { TokenPayloadDto } from 'src/common/dto/tokenPayload.dto';
import { CreateProductDto } from './dto/create.product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProductList(
    @Query() query: QueryStringDto,
    @User() user: TokenPayloadDto,
  ) {
    const userId = user.id;
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
  async createProduct(@Body() body: CreateProductDto) {
    return this.productService.createProduct(body);
  }
}
