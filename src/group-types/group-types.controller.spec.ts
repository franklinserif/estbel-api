import { Test, TestingModule } from '@nestjs/testing';
import { GroupTypesController } from './group-types.controller';
import { GroupTypesService } from './group-types.service';

describe('GroupTypesController', () => {
  let controller: GroupTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupTypesController],
      providers: [
        {
          provide: GroupTypesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GroupTypesController>(GroupTypesController);
    module.get<GroupTypesService>(GroupTypesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
