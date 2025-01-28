import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryStringDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  orderBy?: string;
}
