import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create.dto';
import { UpdateCommentDto } from './dto/update.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async getArticleComments(articleId: string, cursor: string, limit: number) {
    const comments = await this.commentRepository.getArticleComments(
      articleId,
      cursor,
      limit,
    );

    if (!comments) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const nextCursor = comments[comments.length - 1].id;
    const hasNext = comments.length > limit;

    return {
      nextCursor,
      hasNext,
      list: comments.slice(0, limit),
    };
  }

  async getProductComments(productId: string, cursor: string, limit: number) {
    const comments = await this.commentRepository.getProductComments(
      productId,
      cursor,
      limit,
    );

    if (!comments) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const nextCursor = comments[comments.length - 1].id;
    const hasNext = comments.length > limit;

    return {
      nextCursor,
      hasNext,
      list: comments.slice(0, limit),
    };
  }

  async createComment(data: CreateCommentDto, type: 'product' | 'article') {
    try {
      const { productId, articleId, userId, content } = data;

      const comment = await this.commentRepository.createComment({
        productId: type === 'product' ? productId : null,
        articleId: type === 'article' ? articleId : null,
        userId,
        content,
      });

      return comment;
    } catch (error) {
      throw new InternalServerErrorException('댓글 생성 실패');
    }
  }

  async getCommentById(id: string) {
    const comment = await this.commentRepository.getCommentById(id);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    return comment;
  }

  async updateComment(id: string, data: UpdateCommentDto) {
    try {
      const comment = await this.commentRepository.updateComment(id, data);

      return comment;
    } catch (error) {
      throw new InternalServerErrorException('댓글 수정 실패');
    }
  }

  async deleteComment(id: string) {
    try {
      const comment = await this.commentRepository.deleteComment(id);

      return comment;
    } catch (error) {
      throw new InternalServerErrorException('댓글 삭제 실패');
    }
  }
}
