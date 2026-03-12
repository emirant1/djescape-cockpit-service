import { Injectable } from '@nestjs/common';
import { Reference } from '../entities/reference.entity';
import { RequestReferenceDto } from '../dto/request-reference.dto';
import { ResponseReferenceDto } from '../dto/response-reference.dto';

@Injectable()
export class ReferenceMapper {
  /**
   * Maps a RequestReferenceDto to a Reference entity
   * @param dto The request DTO
   * @param creationDate The creation date
   */
  fromDtoToReference(dto: RequestReferenceDto, creationDate: Date): Reference {
    const reference = new Reference();
    reference.title = dto.title;
    reference.url = dto.url;
    reference.description = dto.description;
    reference.createdAt = creationDate;
    reference.updatedAt = creationDate;
    return reference;
  }

  /**
   * Maps a Reference entity to a ResponseReferenceDto
   * @param reference The reference entity
   * @param baseUrl The base URL for HATEOAS links
   */
  fromReferenceToDto(
    reference: Reference,
    baseUrl: string,
  ): ResponseReferenceDto {
    return {
      id: reference.id,
      title: reference.title,
      url: reference.url,
      description: reference.description,
      createdAt: reference.createdAt,
      updatedAt: reference.updatedAt,
      _links: {
        self: { href: `${baseUrl}/cockpit/reference/${reference.id}` },
        all: { href: `${baseUrl}/cockpit/references` },
      },
    };
  }
}
