import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
