import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaService';
import { WhereConditionDto } from './dto/whereCondition.dto';
import { QueryStringDto } from './dto/queryString.dto';
import { CreateArticleDto } from './dto/create.dto';
import { UpdateArticleDto } from './dto/update.dto';

@Injectable()
export class ArticleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getArticleList(
    cursor: string,
    limit: number,
    whereCondition: WhereConditionDto,
    orderByQuery: { [key: string]: string },
  ) {
    return this.prismaService.article.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereCondition,
      orderBy: orderByQuery,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        owner: {
          select: {
            nickname: true,
          },
        },
        _count: {
          select: {
            isFavorite: true,
          },
        },
      },
    });
  }

  getArticleById(id: string) {
    return this.prismaService.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        owner: {
          select: {
            nickname: true,
          },
        },
        _count: {
          select: {
            isFavorite: true,
          },
        },
      },
    });
  }

  createArticle(data: CreateArticleDto) {
    return this.prismaService.article.create({
      data,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });
  }

  updateArticle(id: string, data: UpdateArticleDto) {
    return this.prismaService.article.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        owner: {
          select: {
            nickname: true,
          },
        },
        _count: {
          select: {
            isFavorite: true,
          },
        },
      },
    });
  }

  existArticle(userId: string, id: string) {
    return this.prismaService.article.findFirst({
      where: {
        id,
        isFavorite: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  likeArticle(userId: string, id: string) {
    return this.prismaService.article.update({
      where: { id },
      data: { isFavorite: { connect: { id: userId } } },
    });
  }

  unLikeArticle(userId: string, id: string) {
    return this.prismaService.article.update({
      where: { id },
      data: { isFavorite: { disconnect: { id: userId } } },
    });
  }

  deleteArticle(id: string) {
    return this.prismaService.article.delete({
      where: { id },
    });
  }
}
