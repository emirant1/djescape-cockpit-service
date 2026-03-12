import { IsCustomDate } from '../../../common/decorators/custom-date.decorator';
import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RequestEventDto {
  /**
   * This will be the title of the event that is being created
   */
  @IsString()
  @IsNotEmpty({ message: 'The title cannot be empty' })
  @IsDefined()
  @MaxLength(255)
  title: string;

  /**
   * The date where the event will take place. This will be provided
   * as an input of type string with format: dd.MM.yyyy
   */
  @IsCustomDate()
  eventDate: string;
}
