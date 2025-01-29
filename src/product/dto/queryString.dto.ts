import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryStringDto {
  @IsString()
  @IsOptional()
  cursor: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  keyword: string;

  @IsString()
  @IsOptional()
  orderBy: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  pageNumber: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  pageSize: number;
}
