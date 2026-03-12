import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseEventDto } from '../dto/response-event.dto';
import { RequestEventDto } from '../dto/request-event.dto';
import { Event } from '../entity/event.entity';
import { EventMapper } from '../mapper/event.mapper';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly eventMapper: EventMapper,
  ) {}

  /**
   * This function will create a list of events.
   * @param requestDtoList The data transfer objects
   * @param baseUrl The base URL for HATEOAS
   */
  createEvents = async (
    requestDtoList: RequestEventDto[],
    baseUrl: string,
  ): Promise<ResponseEventDto[]> => {
    const creationDate = new Date();

    const events = requestDtoList.map((dto) =>
      this.eventRepository.create(
        this.eventMapper.fromDtoToEvent(dto, creationDate),
      ),
    );

    const savedEvents = await this.eventRepository.save(events);

    return savedEvents.map((event) =>
      this.eventMapper.fromEventToDto(event, baseUrl),
    );
  };

  /**
   * This function retrieves the list of all events from the database.
   * @param baseUrl The Base URL that will be used for HATEOAS
   */
  getAllEvents = async (baseUrl: string): Promise<ResponseEventDto[]> => {
    const events = await this.eventRepository.find();
    return events.map((event) =>
      this.eventMapper.fromEventToDto(event, baseUrl),
    );
  };

  /**
   * This function returns the event according to its id. An NotFoundException will be thrown
   * if the entity with the given id could not be retrieved.
   * @param id The identification number of the event.
   * @param baseUrl The Base URL that will be used for HATEOAS
   */
  getEventById = async (
    id: number,
    baseUrl: string,
  ): Promise<ResponseEventDto> => {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return this.eventMapper.fromEventToDto(event, baseUrl);
  };

  /**
   * This function will save the modified event with the identification number defined.
   * @param id The identification number of the event
   * @param request The user data.
   * @param baseUrl The base URL for HATEOAS
   */
  updateEventById = async (
    id: number,
    request: RequestEventDto,
    baseUrl: string,
  ): Promise<ResponseEventDto> => {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event || !request) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    /* Set the values using the mapper to properly transform the date */
    const updatedDate = new Date();
    const mappedEvent = this.eventMapper.fromDtoToEvent(
      request,
      event.createdAt,
      updatedDate,
    );
    Object.assign(event, mappedEvent);

    const savedEvent = await this.eventRepository.save(event);

    return this.eventMapper.fromEventToDto(savedEvent, baseUrl);
  };

  /**
   * This function will delete the event with the given id
   * @param id The identification number of the event to be deleted
   */
  deleteEvent = async (id: number): Promise<void> => {
    const result = await this.eventRepository.delete(id);

    if ((result?.affected ?? 0) === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  };
}
