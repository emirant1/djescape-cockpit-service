import { EventMapper } from './event.mapper';
import { RequestEventDto } from '../dto/request-event.dto';
import { Event } from '../entity/event.entity';
import { plainToInstance } from 'class-transformer';

describe('EventMapper', () => {
  let mapper: EventMapper;

  beforeEach(() => {
    mapper = new EventMapper();
  });

  describe('fromDtoToEvent', () => {
    it('should map RequestEventDto to Event entity without updated date', async () => {
      const eventDateAttribute = '25.12.2025';

      const dto: RequestEventDto = plainToInstance(RequestEventDto, {
        title: 'Test Event',
        eventDate: eventDateAttribute,
      });

      const created = new Date('2024-01-15T10:00:00Z');
      const result = mapper.fromDtoToEvent(dto, created);

      expect(result).toEqual({
        title: 'Test Event',
        eventDate: '2025-12-25',
        createdAt: created,
        updatedAt: created,
      });
    });

    it('should map RequestEventDto to Event entity with updated date', async () => {
      const dto: RequestEventDto = plainToInstance(RequestEventDto, {
        title: 'Updated Event',
        eventDate: '31.12.2024',
      });
      const created = new Date('2024-01-15T10:00:00Z');
      const updated = new Date('2024-02-20T14:30:00Z');

      const result = mapper.fromDtoToEvent(dto, created, updated);

      expect(result).toEqual({
        title: 'Updated Event',
        eventDate: '2024-12-31',
        createdAt: created,
        updatedAt: updated,
      });
    });

    it('should use created date as updatedAt when updated is undefined', () => {
      const dto: RequestEventDto = {
        title: 'Event',
        eventDate: '15.06.2024',
      };
      const created = new Date('2024-01-01T00:00:00Z');

      const result = mapper.fromDtoToEvent(dto, created, undefined);

      expect(result.updatedAt).toBe(created);
    });

    it('should handle empty title', () => {
      const dto: RequestEventDto = {
        title: '',
        eventDate: '01.01.2024',
      };
      const created = new Date();

      const result = mapper.fromDtoToEvent(dto, created);

      expect(result.title).toBe('');
    });
  });

  describe('fromEventToDto', () => {
    it('should map Event entity to ResponseEventDto with HATEOAS links', () => {
      const event: Event = {
        id: 1,
        title: 'Test Event',
        eventDate: '2024-12-25',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-02-20T14:30:00Z'),
      };
      const baseUrl = 'http://localhost:3000';

      const result = mapper.fromEventToDto(event, baseUrl);

      expect(result).toEqual({
        id: 1,
        title: 'Test Event',
        eventDate: '2024-12-25',
        _links: [
          {
            href: 'http://localhost:3000/cockpit/event/1',
            method: 'GET',
            rel: 'self',
          },
          {
            href: 'http://localhost:3000/cockpit/event/1',
            method: 'PUT',
            rel: 'update',
          },
          {
            href: 'http://localhost:3000/cockpit/event/1',
            method: 'DELETE',
            rel: 'delete',
          },
          {
            href: 'http://localhost:3000/cockpit/events',
            method: 'GET',
            rel: 'all-events',
          },
        ],
      });
    });

    it('should generate correct HATEOAS links with different base URLs', () => {
      const event: Event = {
        id: 42,
        title: 'Another Event',
        eventDate: '2024-07-04',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const baseUrl = 'https://api.example.com';

      const result = mapper.fromEventToDto(event, baseUrl);

      expect(result._links).toEqual([
        {
          href: 'https://api.example.com/cockpit/event/42',
          method: 'GET',
          rel: 'self',
        },
        {
          href: 'https://api.example.com/cockpit/event/42',
          method: 'PUT',
          rel: 'update',
        },
        {
          href: 'https://api.example.com/cockpit/event/42',
          method: 'DELETE',
          rel: 'delete',
        },
        {
          href: 'https://api.example.com/cockpit/events',
          method: 'GET',
          rel: 'all-events',
        },
      ]);
    });

    it('should handle event with id 0', () => {
      const event: Event = {
        id: 0,
        title: 'Event Zero',
        eventDate: '2024-01-01',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const baseUrl = 'http://localhost:3000';

      const result = mapper.fromEventToDto(event, baseUrl);

      expect(result.id).toBe(0);
      expect(result?._links?.[0].href).toContain('/event/0');
    });

    it('should include all required HATEOAS link relations', () => {
      const event: Event = {
        id: 1,
        title: 'Test',
        eventDate: '2024-01-01',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = mapper.fromEventToDto(event, 'http://localhost:3000');

      const rels = result?._links?.map((link) => link.rel);
      expect(rels).toContain('self');
      expect(rels).toContain('update');
      expect(rels).toContain('delete');
      expect(rels).toContain('all-events');
    });

    it('should include all HTTP methods in HATEOAS links', () => {
      const event: Event = {
        id: 1,
        title: 'Test',
        eventDate: '2024-01-01',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = mapper.fromEventToDto(event, 'http://localhost:3000');

      const methods = result?._links?.map((link) => link.method);
      expect(methods).toContain('GET');
      expect(methods).toContain('PUT');
      expect(methods).toContain('DELETE');
    });
  });
});
