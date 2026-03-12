import { AboutMapper } from './about.mapper';
import { RequestAboutDto } from '../dto/request-about.dto';
import { About } from '../entity/about.entity';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('AboutMapper', () => {
    let mapper: AboutMapper;

    beforeEach(() => {
        mapper = new AboutMapper();
    });

    describe('fromDtoToAbout', () => {
        it('should map RequestAboutDto to About entity without updated date', async () => {

            /* plainToInstance converts a plain JavaScript object înto an instance of the class */
            const dto: RequestAboutDto = plainToInstance(RequestAboutDto, { text: 'This is the about section content' });
            const created = new Date('2024-01-15T10:00:00Z');

            const result = mapper.fromDtoToAbout(dto, created);

            /* Activates the validation set by the decorators */
            const errors = await validate(dto);

            expect(errors.length).toBe(0);

            expect(result).toEqual({
                text: 'This is the about section content',
                createdAt: created,
                updatedAt: created,
            });
        });

        it('should map RequestAboutDto to About entity with updated date', async () => {
            const dto: RequestAboutDto = plainToInstance(RequestAboutDto, { text: 'Updated about content' });
            const created = new Date('2024-01-15T10:00:00Z');
            const updated = new Date('2024-02-20T14:30:00Z');

            const result = mapper.fromDtoToAbout(dto, created, updated);

            /* Activates the validation set by the decorators */
            const errors = await validate(dto);

            expect(errors.length).toBe(0);

            expect(result).toEqual({
                text: 'Updated about content',
                createdAt: created,
                updatedAt: updated,
            });
        });

        it('should use created date as updatedAt when updated is undefined', async () => {
            const dto: RequestAboutDto = plainToInstance(RequestAboutDto, { text: 'About text' });
            const created = new Date('2024-01-01T00:00:00Z');

            const result = mapper.fromDtoToAbout(dto, created, undefined);

            /* Activates the validation set by the decorators */
            const errors = await validate(dto);

            expect(errors.length).toBe(0);

            expect(result.updatedAt).toBe(created);
        });

        it('should throw an error whe the text is empty', async () => {
            const dto: RequestAboutDto = plainToInstance(RequestAboutDto, { text: '' });

            /* Activates the validation set by the decorators */
            const errors = await validate(dto);

            expect(errors.length).toBe(1);
        });

        it('should handle long text content', async () => {
            const longText = 'a'.repeat(255);
            const dto: RequestAboutDto = plainToInstance(RequestAboutDto, { text: longText });
            const created = new Date();

            /* Activates the validation set by the decorators */
            const errors = await validate(dto);
            expect(errors.length).toBe(0);

            const result = mapper.fromDtoToAbout(dto, created);

            expect(result.text).toBe(longText);
            expect(result.text.length).toBe(255);
        });

        it('should throw an error when the text is too long', async () => {
            const longText = 'a'.repeat(3001);
            const dto: RequestAboutDto = plainToInstance(RequestAboutDto, { text: longText });

            /* Activates the validation set by the decorators */
            const errors = await validate(dto);
            expect(errors.length).toBe(1);
        });

        it('should throw an error when the text is undefined', async () => {
            const dto: RequestAboutDto = plainToInstance(RequestAboutDto, { text: undefined });

            /* Activates the validation set by the decorators */
            const errors = await validate(dto);
            expect(errors.length).toBe(1);
        });

        it('should throw an error when the text is a number', async () => {
            const dto: RequestAboutDto = plainToInstance(RequestAboutDto, { text: 123 });

            /* Activates the validation set by the decorators */
            const errors = await validate(dto);
            expect(errors.length).toBe(1);
        });
    });

    describe('fromAboutToDto', () => {
        it('should map About entity to ResponseAboutDto with HATEOAS links', () => {
            const about: About = {
                id: 1,
                text: 'About section content',
                createdAt: new Date('2024-01-15T10:00:00Z'),
                updatedAt: new Date('2024-02-20T14:30:00Z'),
                deletedAt: null,
            };
            const baseUrl = 'http://localhost:3000';

            const result = mapper.fromAboutToDto(about, baseUrl);

            expect(result).toEqual({
                id: 1,
                text: 'About section content',
                deletedAt: null,
                _links: [
                    { href: 'http://localhost:3000/cockpit/about/1', method: 'GET', rel: 'self' },
                    { href: 'http://localhost:3000/cockpit/about/1', method: 'PUT', rel: 'update' },
                    { href: 'http://localhost:3000/cockpit/about/1', method: 'DELETE', rel: 'delete' },
                    { href: 'http://localhost:3000/cockpit/about', method: 'GET', rel: 'current-about' },
                ],
            });
        });

        it('should handle deleted about entity', () => {
            const deletedDate = new Date('2024-03-01T00:00:00Z');
            const about: About = {
                id: 2,
                text: 'Deleted about content',
                createdAt: new Date('2024-01-15T10:00:00Z'),
                updatedAt: new Date('2024-02-20T14:30:00Z'),
                deletedAt: deletedDate,
            };
            const baseUrl = 'http://localhost:3000';

            const result = mapper.fromAboutToDto(about, baseUrl);

            expect(result.deletedAt).toBe(deletedDate);
        });

        it('should generate correct HATEOAS links with different base URLs', () => {
            const about: About = {
                id: 42,
                text: 'Another about section',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            const baseUrl = 'https://api.example.com';

            const result = mapper.fromAboutToDto(about, baseUrl);

            expect(result._links).toEqual([
                { href: 'https://api.example.com/cockpit/about/42', method: 'GET', rel: 'self' },
                { href: 'https://api.example.com/cockpit/about/42', method: 'PUT', rel: 'update' },
                { href: 'https://api.example.com/cockpit/about/42', method: 'DELETE', rel: 'delete' },
                { href: 'https://api.example.com/cockpit/about', method: 'GET', rel: 'current-about' },
            ]);
        });

        it('should handle about entity with id 0', () => {
            const about: About = {
                id: 0,
                text: 'About Zero',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            const baseUrl = 'http://localhost:3000';

            const result = mapper.fromAboutToDto(about, baseUrl);

            expect(result.id).toBe(0);
            expect(result._links?.[0].href).toContain('/about/0');
        });

        it('should include all required HATEOAS link relations', () => {
            const about: About = {
                id: 1,
                text: 'Test',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            const result = mapper.fromAboutToDto(about, 'http://localhost:3000');

            const rels = result._links?.map(link => link.rel);
            expect(rels).toContain('self');
            expect(rels).toContain('update');
            expect(rels).toContain('delete');
            expect(rels).toContain('current-about');
        });

        it('should include all HTTP methods in HATEOAS links', () => {
            const about: About = {
                id: 1,
                text: 'Test',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            const result = mapper.fromAboutToDto(about, 'http://localhost:3000');

            const methods = result._links?.map(link => link.method);
            expect(methods).toContain('GET');
            expect(methods).toContain('PUT');
            expect(methods).toContain('DELETE');
        });

        it('should map all properties correctly', () => {
            const about: About = {
                id: 5,
                text: 'Complete test',
                createdAt: new Date('2024-01-01T00:00:00Z'),
                updatedAt: new Date('2024-02-01T00:00:00Z'),
                deletedAt: null,
            };

            const result = mapper.fromAboutToDto(about, 'http://localhost:3000');

            expect(result.id).toBe(about.id);
            expect(result.text).toBe(about.text);
            expect(result.deletedAt).toBe(about.deletedAt);
            expect(result._links).toBeDefined();
            expect(result._links?.length).toBe(4);
        });
    });
});