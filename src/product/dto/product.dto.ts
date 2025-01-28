export class ProductDto {
  id: string;
  name: string;
  price: number;
  description: string;
  createdAt: Date;
  owner: {
    nickname: string;
  };
  isFavorite: {
    id: string;
  }[];
}
