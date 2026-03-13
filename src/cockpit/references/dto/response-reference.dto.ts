import { Category } from '../entities/reference.entity';

export class ResponseReferenceDto {
  id: number;
  title?: string;
  url: string;
  description: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
  _links?: {
    self: { href: string };
    all: { href: string };
  };
}
