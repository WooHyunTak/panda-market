import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  productId?: string;

  @IsString()
  articleId?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
