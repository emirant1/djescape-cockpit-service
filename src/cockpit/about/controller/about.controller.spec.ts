import { Test, TestingModule } from '@nestjs/testing';
import { AboutController } from './about.controller';
import { AboutService } from '../service/about.service';

describe('AboutController', () => {
  let controller: AboutController;

  const mockAboutService = {
    getAllAbouts: jest.fn(),
    getAbout: jest.fn(),
    createAbout: jest.fn(),
    updateAbout: jest.fn(),
    deleteAbout: jest.fn(),
    hardDeleteAllAbouts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutController],
      providers: [
        {
          provide: AboutService,
          useValue: mockAboutService,
        },
      ],
    }).compile();

    controller = module.get<AboutController>(AboutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
