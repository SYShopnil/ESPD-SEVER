import { Test, TestingModule } from '@nestjs/testing';
import { GscController } from './gsc.controller';
import { GscService } from './gsc.service';

describe('GscController', () => {
  let controller: GscController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GscController],
      providers: [GscService],
    }).compile();

    controller = module.get<GscController>(GscController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
