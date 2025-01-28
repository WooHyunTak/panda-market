export class CreateProductDto {
  name: string;
  price: number;
  description: string;
  images?: string[];
  tags?: string[];
}
