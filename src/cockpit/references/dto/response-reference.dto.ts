export class ResponseReferenceDto {
  id: number;
  title: string;
  url: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  _links?: {
    self: { href: string };
    all: { href: string };
  };
}
