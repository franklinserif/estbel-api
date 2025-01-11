import { Test, TestingModule } from '@nestjs/testing';
import { GroupTypesService } from './group-types.service';

describe('GroupTypesService', () => {
  let service: GroupTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupTypesService],
    }).compile();

    service = module.get<GroupTypesService>(GroupTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
