import { IsNumber, IsString, IsOptional } from 'class-validator';

export class QueryStringDto {
  @IsString()
  @IsOptional()
  cursor: string;

  @IsNumber()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  keyword: string;

  @IsString()
  @IsOptional()
  orderBy: string;

  @IsNumber()
  @IsOptional()
  pageNumber: number;

  @IsNumber()
  @IsOptional()
  pageSize: number;
}
