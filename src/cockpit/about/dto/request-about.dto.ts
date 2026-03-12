import { IsString, IsNotEmpty, MaxLength, IsDefined } from 'class-validator';

export class RequestAboutDto {
  /**
   * The text content for the about section
   */
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @MaxLength(3000)
  text: string;
}
