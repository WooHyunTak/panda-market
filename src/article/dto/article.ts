export class ArticleDto {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  owner: {
    nickname: string;
  };
  _count: {
    isFavorite: number;
  };
}
