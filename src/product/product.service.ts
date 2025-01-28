import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { WhereConditionDto } from './dto/whereCondition.dto';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProductList(
    userId: string | null,
    pageNumber: number,
    pageSize: number,
    keyword: string,
    orderBy: string,
  ) {
    let where: WhereConditionDto = {};
    if (keyword) {
      where = {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      };
    }
    const [productList, totalCount] = await Promise.all([
      this.productRepository.getProductList(
        pageNumber,
        pageSize,
        where,
        this.setOrderBy(orderBy),
      ),
      this.productRepository.getProductTotalCount(where),
    ]);

    const hasNextPage = totalCount > pageNumber * pageSize;

    return {
      hasNextPage,
      currentPage: pageNumber,
      totalPage: Math.ceil(totalCount / pageSize),
      list: this.setIsFavorite(userId, productList),
    };
  }

  async getProductById(id: string) {
    const product = await this.productRepository.getProductById(id);
    return this.setIsFavorite(null, product)[0];
  }

  async createProduct(data: CreateProductDto) {
    return this.productRepository.createProduct(data);
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    return this.productRepository.updateProduct(id, data);
  }

  async favoriteProduct(userId: string, productId: string) {
    return this.productRepository.likeProduct(userId, productId);
  }

  async unfavoriteProduct(userId: string, productId: string) {
    return this.productRepository.unLikeProduct(userId, productId);
  }

  async deleteProduct(id: string) {
    return this.productRepository.deleteProduct(id);
  }

  private async setIsFavorite(
    userId: string | null,
    product: ProductDto[] | ProductDto,
  ) {
    const productList = Array.isArray(product) ? product : [product];

    return productList.map((product) => {
      const { isFavorite } = product;
      return {
        ...product,
        isFavorite: isFavorite.some((favorite) => favorite.id === userId),
      };
    });
  }

  private setOrderBy(orderBy: string) {
    switch (orderBy) {
      case 'recent':
        return { createdAt: 'desc' };
      case 'oldest':
        return { createdAt: 'asc' };
      case 'price':
        return { price: 'desc' };
      case 'price_asc':
        return { price: 'asc' };
      case 'favorite':
        return {
          isFavorite: {
            _count: 'desc',
          },
        };
      default:
        return { createdAt: 'desc' };
    }
  }
}
