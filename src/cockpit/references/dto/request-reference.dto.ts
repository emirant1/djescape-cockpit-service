import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Category } from '../entities/reference.entity';

export class RequestReferenceDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  description: string;

  category: Category;
}
