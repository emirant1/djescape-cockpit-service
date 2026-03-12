import { Transform } from 'class-transformer';
import { HateoasLink } from '../../../common/interface/cockpit.interface';

export class ResponseEventDto {
  /**
   * The identification of the number. It will be used to interact with the object
   */
  id: number;

  /**
   * This will be the title of the event that is being created
   */
  title: string;

  /**
   * The date where the event will take place. This will be provided
   * to the user in format: dd.MM.yyyy
   */
  @Transform(({ value }) => {
    const [year, month, day] = value.split('-');
    return `${year}-${month}-${day}`;
  })
  eventDate: string;

  /**
   * HATEOAS links for hypermedia navigation
   */
  _links?: HateoasLink[];
}
