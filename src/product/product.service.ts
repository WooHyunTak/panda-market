import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { WhereConditionDto } from './dto/whereCondition.dto';
import { ProductDto } from './dto/product.dto';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CLIENT } from 'src/common/providers/s3.client.provider';
import { S3Client } from '@aws-sdk/client-s3';
import { Inject } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(S3_CLIENT) private readonly s3: S3Client,
  ) {}

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

    const processedProductList = await this.processProduct(userId, productList);

    return {
      hasNextPage,
      totalCount,
      totalPage: Math.ceil(totalCount / pageSize),
      list: processedProductList,
    };
  }

  async getProductById(userId: string | null, id: string) {
    const product = await this.productRepository.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const processedProduct = await this.processProduct(userId, product);
    return processedProduct[0];
  }

  async createProduct(userId: string, data: CreateProductDto) {
    return this.productRepository.createProduct(userId, data);
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

  private async processProduct(
    userId: string | null,
    product: ProductDto[] | ProductDto,
  ) {
    const productList = Array.isArray(product) ? product : [product];

    return productList.map(async (product) => {
      const { isFavorite } = product;
      const signedUrls = await Promise.all(
        product.images.map(async (imageUrl) => {
          const imageKey = imageUrl.replace(
            'https://panda-market-0001.s3.ap-northeast-2.amazonaws.com/',
            '',
          );

          const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageKey,
          });

          const url = await getSignedUrl(this.s3, command, {
            expiresIn: 1000 * 60 * 5, // URL의 유효 기간 5분
          });

          return url;
        }),
      );
      return {
        ...product,
        isFavorite: isFavorite.some((favorite) => favorite.id === userId),
        images: signedUrls,
      };
    });
  }

  private setOrderBy(orderBy: string) {
    switch (orderBy) {
      case 'recent':
        return { createdAt: 'desc' };
      case 'oldest':
        return { createdAt: 'asc' };
      case 'title':
        return { title: 'asc' };
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
