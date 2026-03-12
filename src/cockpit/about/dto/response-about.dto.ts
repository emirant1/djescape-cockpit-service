import { HateoasLink } from '../../../common/interface/cockpit.interface';

export class ResponseAboutDto {
  /**
   * The identification of the about record
   */
  id: number;

  /**
   * The text content for the about section
   */
  text: string;

  /**
   * This flag will be displayed to the administrators
   */
  deletedAt?: Date | null;

  /**
   * HATEOAS links for hypermedia navigation
   */
  _links?: HateoasLink[];
}
