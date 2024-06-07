import { Test, TestingModule } from '@nestjs/testing';
import { GscService } from './gsc.service';

describe('GscService', () => {
  let service: GscService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GscService],
    }).compile();

    service = module.get<GscService>(GscService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
