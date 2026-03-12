import { Test, TestingModule } from '@nestjs/testing';
import { ReferencesController } from './references.controller';
import { ReferencesService } from './references.service';

describe('ReferencesController', () => {
  let controller: ReferencesController;

  const mockReferencesService = {
    getAllReferences: jest.fn(),
    getReferenceById: jest.fn(),
    createReference: jest.fn(),
    updateReferenceById: jest.fn(),
    deleteReference: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferencesController],
      providers: [
        {
          provide: ReferencesService,
          useValue: mockReferencesService,
        },
      ],
    }).compile();

    controller = module.get<ReferencesController>(ReferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
