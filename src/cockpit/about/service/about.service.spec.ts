import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AboutService } from './about.service';
import { About } from '../entity/about.entity';
import { AboutMapper } from '../mapper/about.mapper';

describe('AboutService', () => {
  let service: AboutService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  const mockMapper = {
    fromAboutToDto: jest.fn(),
    fromDtoToAbout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AboutService,
        { provide: getRepositoryToken(About), useValue: mockRepository },
        { provide: AboutMapper, useValue: mockMapper },
      ],
    }).compile();

    service = module.get<AboutService>(AboutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
