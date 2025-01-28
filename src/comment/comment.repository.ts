import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaService';
import { CreateCommentDto } from './dto/create.dto';
import { UpdateCommentDto } from './dto/update.dto';

@Injectable()
export class CommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getArticleComments(articleId: string, cursor: string, limit: number) {
    return this.prismaService.comment.findMany({
      where: { articleId },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });
  }

  getProductComments(productId: string, cursor: string, limit: number) {
    return this.prismaService.comment.findMany({
      where: { productId },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });
  }

  getCommentById(id: string) {
    return this.prismaService.comment.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });
  }

  createComment(data: CreateCommentDto) {
    return this.prismaService.comment.create({
      data,
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });
  }

  updateComment(id: string, data: UpdateCommentDto) {
    return this.prismaService.comment.update({
      where: { id },
      data,
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });
  }

  deleteComment(id: string) {
    return this.prismaService.comment.delete({
      where: { id },
    });
  }
}
