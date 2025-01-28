import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { QueryStringDto } from './dto/queryString.dto';
import { WhereConditionDto } from './dto/whereCondition.dto';
import { ArticleDto } from './dto/article';
import { CreateArticleDto } from './dto/create.dto';
import { UpdateArticleDto } from './dto/update.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async getArticleList(
    cursor: string,
    limit: number,
    keyword: string,
    orderBy: string,
  ) {
    const whereCondition: WhereConditionDto = {};
    const orderByQuery: { [key: string]: string } =
      this.getOrderByQuery(orderBy);

    if (keyword) {
      whereCondition.OR = [
        {
          title: {
            contains: keyword,
          },
        },
        {
          content: {
            contains: keyword,
          },
        },
      ];
    }

    const articleList = await this.articleRepository.getArticleList(
      cursor,
      limit,
      whereCondition,
      orderByQuery,
    );

    const hasNext = articleList.length > limit;
    const nextCursor = hasNext ? articleList[articleList.length - 1].id : null;

    const processedArticleList = await this.processArticle(null, articleList);

    return {
      hasNext,
      nextCursor,
      list: processedArticleList.slice(0, limit),
    };
  }

  async getArticleById(userId: string, articleId: string) {
    const article = await this.articleRepository.getArticleById(articleId);

    if (!article) {
      throw new NotFoundException('게시글이 없습니다.');
    }

    return this.processArticle(userId, article)[0];
  }

  async createArticle(userId: string, data: CreateArticleDto) {
    try {
      const article = await this.articleRepository.createArticle({
        ...data,
        ownerId: userId,
    });

      return article;
    } catch (error) {
      throw new InternalServerErrorException('게시글 생성 실패');
    }
  }

  async likeArticle(userId: string, articleId: string) {
    await this.articleRepository.likeArticle(userId, articleId);
  }

  async unLikeArticle(userId: string, articleId: string) {
    await this.articleRepository.unLikeArticle(userId, articleId);
  }

  async updateArticle(articleId: string, data: UpdateArticleDto) {
    try {
      const article = await this.articleRepository.updateArticle(
        articleId,
        data,
      );

      return article;
    } catch (error) {
      throw new InternalServerErrorException('게시글 수정 실패');
    }
  }

  async deleteArticle(articleId: string) {
    try {
      await this.articleRepository.deleteArticle(articleId);
    } catch (error) {
      throw new InternalServerErrorException('게시글 삭제 실패');
    }
  }

  private getOrderByQuery(orderBy: string) {
    switch (orderBy) {
      case 'title':
        return { title: 'asc' };
      case 'recent':
        return { createdAt: 'desc' };
      case 'oldset':
        return { createdAt: 'asc' };
      case 'favorite':
        return { favoriteCount: 'desc' };
      default:
        return { createdAt: 'desc' };
    }
  }

  private async processArticle(
    userId: string | null,
    article: ArticleDto[] | ArticleDto,
  ) {
    const articles = Array.isArray(article) ? article : [article];
    return articles.map(async (article) => {
      const { _count, ...articleData } = article;
      const isFavorite = await this.articleRepository.existArticle(
        userId,
        article.id,
      );
      return {
        ...articleData,
        favoriteCount: _count.isFavorite,
        isFavorite: isFavorite ? true : false,
      };
    });
  }
}
