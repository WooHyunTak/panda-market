export class WhereConditionDto {
  OR?: {
    name?: { contains: string };
    description?: { contains: string };
  }[];
}
