import { RequestEventDto } from '../dto/request-event.dto';
import { Event } from '../entity/event.entity';
import { Injectable } from '@nestjs/common';
import { ResponseEventDto } from '../dto/response-event.dto';
import { HateoasLink } from '../../../common/interface/cockpit.interface';

@Injectable()
export class EventMapper {
  /**
   * This function takes the Data Transfer Object (client input) and converts it into
   * a TypeOrm Entity, that will be persisted
   * @param dto The user input.
   * @param created The timestamp when the event has been created.
   * @param updated The timestamp of the last modification
   */
  fromDtoToEvent = (
    dto: RequestEventDto,
    created: Date,
    updated?: Date,
  ): Omit<Event, 'id'> => {
    const [day, month, year] = dto.eventDate.split('.');
    return {
      title: dto.title,
      eventDate: `${year}-${month}-${day}`,
      createdAt: created,
      updatedAt: updated ?? created,
    };
  };

  /**
   * This function takes the entity retrieved from the database and converts it
   * into the Data Transfer Object that will be provided to the user.
   * @param event The TypeOrm entity from the database
   * @param baseUrl The base URL that will be used to generate the HATEOAS links
   */
  fromEventToDto = (event: Event, baseUrl: string): ResponseEventDto => {
    const [year, month, day] = event.eventDate.split('-');
    return {
      id: event.id,
      title: event.title,
      eventDate: `${day}.${month}.${year}`,
      _links: this._buildEventLinks(event.id, baseUrl),
    };
  };

  /**
   * Private helper method that generates HATEOAS links
   * @param eventId The id of the event that will be reused as a path variable
   * @param baseUrl The base URL to provide FQDNs as links
   */
  private _buildEventLinks = (
    eventId: number,
    baseUrl: string,
  ): HateoasLink[] => {
    return [
      {
        href: `${baseUrl}/cockpit/event/${eventId}`,
        method: 'GET',
        rel: 'self',
      },
      {
        href: `${baseUrl}/cockpit/event/${eventId}`,
        method: 'PUT',
        rel: 'update',
      },
      {
        href: `${baseUrl}/cockpit/event/${eventId}`,
        method: 'DELETE',
        rel: 'delete',
      },
      { href: `${baseUrl}/cockpit/events`, method: 'GET', rel: 'all-events' },
    ];
  };
}
