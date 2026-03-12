import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReferencesService } from './references.service';
import { Reference } from './entities/reference.entity';
import { ReferenceMapper } from './mapper/reference.mapper';

describe('ReferencesService', () => {
  let service: ReferencesService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockMapper = {
    fromReferenceToDto: jest.fn(),
    fromDtoToReference: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferencesService,
        {
          provide: getRepositoryToken(Reference),
          useValue: mockRepository,
        },
        {
          provide: ReferenceMapper,
          useValue: mockMapper,
        },
      ],
    }).compile();

    service = module.get<ReferencesService>(ReferencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
