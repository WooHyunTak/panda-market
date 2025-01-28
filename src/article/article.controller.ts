import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { QueryStringDto } from './dto/queryString.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { TokenPayloadDto } from 'src/common/dto/tokenPayload.dto';
import { CreateArticleDto } from './dto/create.dto';
import { UpdateArticleDto } from './dto/update.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getArticleList(@Query() query: QueryStringDto) {
    const { cursor = '', limit = 10, keyword = '', orderBy = 'recent' } = query;
    return await this.articleService.getArticleList(
      cursor,
      limit,
      keyword,
      orderBy,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getArticleById(@Param('id') id: string, @User() user: TokenPayloadDto) {
    return await this.articleService.getArticleById(user.id, id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createArticle(
    @Body() body: CreateArticleDto,
    @User() user: TokenPayloadDto,
  ) {
    return await this.articleService.createArticle(user.id, body);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard('jwt'))
  async favoriteArticle(
    @Param('id') id: string,
    @User() user: TokenPayloadDto,
  ) {
    return await this.articleService.likeArticle(user.id, id);
  }

  @Delete(':id/favorite')
  @UseGuards(AuthGuard('jwt'))
  async unFavoriteArticle(
    @Param('id') id: string,
    @User() user: TokenPayloadDto,
  ) {
    return await this.articleService.unLikeArticle(user.id, id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateArticle(@Param('id') id: string, @Body() body: UpdateArticleDto) {
    return await this.articleService.updateArticle(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteArticle(@Param('id') id: string) {
    return await this.articleService.deleteArticle(id);
  }
}
