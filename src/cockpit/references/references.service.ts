import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseReferenceDto } from './dto/response-reference.dto';
import { RequestReferenceDto } from './dto/request-reference.dto';
import { Reference } from './entities/reference.entity';
import { ReferenceMapper } from './mapper/reference.mapper';

@Injectable()
export class ReferencesService {
  constructor(
    @InjectRepository(Reference)
    private readonly referenceRepository: Repository<Reference>,
    private readonly referenceMapper: ReferenceMapper,
  ) {}

  /**
   * This function retrieves the list of all references from the database.
   * @param baseUrl The Base URL that will be used for HATEOAS
   */
  getAllReferences = async (
    baseUrl: string,
  ): Promise<ResponseReferenceDto[]> => {
    const references = await this.referenceRepository.find();
    return references.map((reference) =>
      this.referenceMapper.fromReferenceToDto(reference, baseUrl),
    );
  };

  /**
   * This function returns the reference according to its id. An NotFoundException will be thrown
   * if the entity with the given id could not be retrieved.
   * @param id The identification number of the reference.
   * @param baseUrl The Base URL that will be used for HATEOAS
   */
  getReferenceById = async (
    id: number,
    baseUrl: string,
  ): Promise<ResponseReferenceDto> => {
    const reference = await this.referenceRepository.findOne({ where: { id } });
    if (!reference) {
      throw new NotFoundException(`Reference with ID ${id} not found`);
    }

    return this.referenceMapper.fromReferenceToDto(reference, baseUrl);
  };

  /**
   * This function will create a new reference.
   * @param request The user input
   * @param baseUrl The base URL for HATEOAS
   */
  createReference = async (
    request: RequestReferenceDto,
    baseUrl: string,
  ): Promise<ResponseReferenceDto> => {
    const creationDate = new Date();
    const reference = this.referenceRepository.create(
      this.referenceMapper.fromDtoToReference(request, creationDate),
    );
    const savedReference = await this.referenceRepository.save(reference);

    return this.referenceMapper.fromReferenceToDto(savedReference, baseUrl);
  };

  /**
   * This function will save the modified reference with the identification number defined.
   * @param id The identification number of the reference
   * @param request The user data.
   * @param baseUrl The base URL for HATEOAS
   */
  updateReferenceById = async (
    id: number,
    request: RequestReferenceDto,
    baseUrl: string,
  ): Promise<ResponseReferenceDto> => {
    const reference = await this.referenceRepository.findOne({ where: { id } });

    if (!reference || !request) {
      throw new NotFoundException(`Reference with ID ${id} not found`);
    }

    /* Set the values */
    Object.assign(reference, request);
    reference.updatedAt = new Date();

    const savedReference = await this.referenceRepository.save(reference);

    return this.referenceMapper.fromReferenceToDto(savedReference, baseUrl);
  };

  /**
   * This function will delete the reference with the given id
   * @param id The identification number of the reference to be deleted
   */
  deleteReference = async (id: number): Promise<void> => {
    const result = await this.referenceRepository.delete(id);

    if ((result?.affected ?? 0) === 0) {
      throw new NotFoundException(`Reference with ID ${id} not found`);
    }
  };
}
