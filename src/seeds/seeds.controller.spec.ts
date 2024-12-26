import { Test, TestingModule } from '@nestjs/testing';
import { SeedsController } from './seeds.controller';
import { SeedsService } from './seeds.service';

describe('SeedsController', () => {
  let controller: SeedsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedsController],
      providers: [SeedsService],
    }).compile();

    controller = module.get<SeedsController>(SeedsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
