import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceMapper } from './reference.mapper';

describe('ReferenceMapper', () => {
  let mapper: ReferenceMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferenceMapper],
    }).compile();

    mapper = module.get<ReferenceMapper>(ReferenceMapper);
  });

  it('should be defined', () => {
    expect(mapper).toBeDefined();
  });
});
