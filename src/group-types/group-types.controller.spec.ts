import { Test, TestingModule } from '@nestjs/testing';
import { GroupTypesController } from './group-types.controller';
import { GroupTypesService } from './group-types.service';

describe('GroupTypesController', () => {
  let controller: GroupTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupTypesController],
      providers: [GroupTypesService],
    }).compile();

    controller = module.get<GroupTypesController>(GroupTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
