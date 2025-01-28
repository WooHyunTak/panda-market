import { PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateCommentDto } from '../dto/create.dto';

export class CreateCommentValidationPipe implements PipeTransform {
  transform(value: CreateCommentDto) {
    this.validateData(value);
    return value;
  }

  private validateData(data: CreateCommentDto) {
    if (!data.productId && !data.articleId) {
      throw new BadRequestException('상품 또는 게시글 ID가 필요합니다.');
    }

    if (!data.content || data.content.length > 50) {
      throw new BadRequestException(
        '댓글 내용은 1자 이상 50자 이하여야 합니다.',
      );
    }

    return data;
  }
}
