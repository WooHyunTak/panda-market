import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create.dto';
import { UpdateCommentDto } from './dto/update.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentValidationPipe } from './pipes/create.validation.pipe';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':id')
  getCommentById(@Param('id') id: string) {
    return this.commentService.getCommentById(id);
  }

  @Post(':id/product')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(CreateCommentValidationPipe)
  createProductComment(
    @Param('id') id: string,
    @Body() data: CreateCommentDto,
  ) {
    return this.commentService.createComment(
      { ...data, productId: id },
      'product',
    );
  }

  @Post(':id/article')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(CreateCommentValidationPipe)
  createArticleComment(
    @Param('id') id: string,
    @Body() data: CreateCommentDto,
  ) {
    return this.commentService.createComment(
      { ...data, articleId: id },
      'article',
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateComment(@Param('id') id: string, @Body() data: UpdateCommentDto) {
    return this.commentService.updateComment(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteComment(@Param('id') id: string) {
    return this.commentService.deleteComment(id);
  }
}
