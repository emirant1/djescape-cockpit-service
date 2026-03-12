import { Injectable } from '@nestjs/common';
import { RequestAboutDto } from '../dto/request-about.dto';
import { ResponseAboutDto } from '../dto/response-about.dto';
import { About } from '../entity/about.entity';
import { HateoasLink } from '../../../common/interface/cockpit.interface';

@Injectable()
export class AboutMapper {
  /**
   * This function is a converter that takes the user request via
   * DTO (Data Transfer Object) and converts it to a TypeOrm Entity
   * @param dto The user request
   * @param created The creation date of the entity
   * @param updated Timestamp for when the entity has been updated the last time
   */
  fromDtoToAbout = (
    dto: RequestAboutDto,
    created: Date,
    updated?: Date,
  ): Omit<About, 'id' | 'deletedAt'> => {
    return {
      text: dto.text,
      createdAt: created,
      updatedAt: updated ?? created,
    };
  };

  /**
   * This function is a converter that takes the current entity and converts it into
   * the response DTO (Data Transfer Object) that will be sent to the user.
   * @param about The TypeOrm entity
   * @param baseUrl The base URL needed to build HATEOAS
   */
  fromAboutToDto = (about: About, baseUrl: string): ResponseAboutDto => {
    return {
      text: about.text,
      id: about.id,
      deletedAt: about.deletedAt,
      _links: this._buildAboutLinks(about.id, baseUrl),
    };
  };

  /**
   * Private helper method that will build the HATEOAS URLs.
   * @param aboutId The id of the entity.
   * @param baseUrl The base URL to be able to provide the FQDN to the user.
   */
  private _buildAboutLinks = (
    aboutId: number,
    baseUrl: string,
  ): HateoasLink[] => {
    return [
      {
        href: `${baseUrl}/cockpit/about/${aboutId}`,
        method: 'GET',
        rel: 'self',
      },
      {
        href: `${baseUrl}/cockpit/about/${aboutId}`,
        method: 'PUT',
        rel: 'update',
      },
      {
        href: `${baseUrl}/cockpit/about/${aboutId}`,
        method: 'DELETE',
        rel: 'delete',
      },
      { href: `${baseUrl}/cockpit/about`, method: 'GET', rel: 'current-about' },
    ];
  };
}
