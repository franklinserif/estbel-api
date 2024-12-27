import { Test, TestingModule } from '@nestjs/testing';
import { UserModuleAccessService } from './user-module-access.service';

describe('UserModuleAccessService', () => {
  let service: UserModuleAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserModuleAccessService],
    }).compile();

    service = module.get<UserModuleAccessService>(UserModuleAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
