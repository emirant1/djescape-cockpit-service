import { Category } from '../entities/reference.entity';

export class ResponseReferenceDto {
  id: number;
  title?: string;
  url: string;
  description: string;
  category: Category;
  _links?: {
    self: { href: string };
    all: { href: string };
  };
}