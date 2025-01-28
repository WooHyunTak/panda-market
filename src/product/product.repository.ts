import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaService';
import { WhereConditionDto } from './dto/whereCondition.dto';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getProductTotalCount(where: WhereConditionDto) {
    return this.prismaService.product.count({
      where: where,
    });
  }

  getProductList(
    pageNumber: number,
    pageSize: number,
    where: WhereConditionDto,
    orderBy: { [key: string]: string | { _count: string } },
  ) {
    return this.prismaService.product.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      where: where,
      orderBy,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        createdAt: true,
        owner: {
          select: {
            nickname: true,
          },
        },
        isFavorite: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  getProductById(id: string) {
    return this.prismaService.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        createdAt: true,
        owner: {
          select: {
            nickname: true,
          },
        },
        isFavorite: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  createProduct(data: CreateProductDto) {
    return this.prismaService.product.create({
      data,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        createdAt: true,
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });
  }

  updateProduct(id: string, data: UpdateProductDto) {
    return this.prismaService.product.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        createdAt: true,
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });
  }

  likeProduct(userId: string, productId: string) {
    return this.prismaService.product.update({
      where: { id: productId },
      data: {
        isFavorite: {
          connect: { id: userId },
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        createdAt: true,
        owner: {
          select: {
            nickname: true,
          },
        },
        isFavorite: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  unLikeProduct(userId: string, productId: string) {
    return this.prismaService.product.update({
      where: { id: productId },
      data: {
        isFavorite: {
          disconnect: { id: userId },
        },
      },
    });
  }

  deleteProduct(id: string) {
    return this.prismaService.product.delete({
      where: { id },
    });
  }
}
