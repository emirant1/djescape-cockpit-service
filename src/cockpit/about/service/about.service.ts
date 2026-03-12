import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { ResponseAboutDto } from '../dto/response-about.dto';
import { RequestAboutDto } from '../dto/request-about.dto';
import { About } from '../entity/about.entity';
import { AboutMapper } from '../mapper/about.mapper';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,
    private readonly aboutMapper: AboutMapper,
  ) {}

  /**
   * This function returns the complete set of abouts that have been created. It is usually
   * ment for the admins so that they have all the previous versions of the text in the about
   * section.
   */
  getAllAbouts = async (baseUrl: string): Promise<ResponseAboutDto[]> => {
    const abouts = await this.aboutRepository.find({
      withDeleted: true,
    }); /* Includes soft deleted entries */

    return abouts.map((about) =>
      this.aboutMapper.fromAboutToDto(about, baseUrl),
    );
  };

  /**
   * This function returns the text from the 'about' database which has not been flagged as deleted.
   * There only can be one entry that is not flagged as deleted.
   * @param baseUrl
   */
  getAbout = async (baseUrl: string): Promise<ResponseAboutDto> => {
    const about = await this.aboutRepository.findOne({
      where: { deletedAt: null as any },
      order: { createdAt: 'DESC' },
    });

    if (!about) {
      throw new NotFoundException('About information not found');
    }

    return this.aboutMapper.fromAboutToDto(about, baseUrl);
  };

  /**
   * This function will create a new 'about' section, which is the one that will be not flagged as
   * deleted.
   * @param request The user input (contains only the text)
   * @param baseUrl The base URL that is used for HATEOAS
   */
  createAbout = async (
    request: RequestAboutDto,
    baseUrl: string,
  ): Promise<ResponseAboutDto> => {
    const creationDate = new Date();
    const about = this.aboutRepository.create(
      this.aboutMapper.fromDtoToAbout(request, creationDate),
    );
    const savedAbout = await this.aboutRepository.save(about);

    /* If the 'about' could be created successfully, we need to flag all the other entries as deleted */
    const flagToDeleted = await this.aboutRepository.find();
    flagToDeleted.forEach((about) => {
      if (about.id !== savedAbout.id) {
        about.deletedAt = creationDate;
      }
    });

    /* Saves the newly flagged entities */
    await this.aboutRepository.save(flagToDeleted);

    return this.aboutMapper.fromAboutToDto(savedAbout, baseUrl);
  };

  /**
   * This function will update an existing about. This allows the user to be more flexible and to
   * choose if he wants to just update the existing entry or directly create a new one.
   * @param id The identification number of the entity
   * @param request The data transfer object
   * @param baseUrl The base URL that will be used for HATEOAS
   */
  updateAbout = async (
    id: number,
    request: RequestAboutDto,
    baseUrl: string,
  ): Promise<ResponseAboutDto> => {
    const about = await this.aboutRepository.preload({
      id,
      ...request,
    });

    if (!about) {
      throw new NotFoundException(`About with ID ${id} not found`);
    }

    about.updatedAt = new Date();
    const savedAbout = await this.aboutRepository.save(about);

    return this.aboutMapper.fromAboutToDto(savedAbout, baseUrl);
  };

  /**
   * This function flags the current entry as deleted. This acts as a soft delete in case the user
   * wants to revert a change that he has made.
   * @param id The id of the entity
   */
  deleteAbout = async (id: number): Promise<void> => {
    const updateResult = await this.aboutRepository.softDelete(id);

    if ((updateResult?.affected ?? 0) === 0) {
      throw new NotFoundException(`About with ID ${id} not found`);
    }
  };

  /**
   * This function will delete all entries that have been 'soft deleted'
   * This action should be performed only by the admin of the site
   */
  hardDeleteAllAbouts = async (): Promise<void> => {
    await this.aboutRepository.delete({ deletedAt: Not(IsNull()) });
  };
}
