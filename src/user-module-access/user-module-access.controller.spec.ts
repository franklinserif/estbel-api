import { Test, TestingModule } from '@nestjs/testing';
import { UserModuleAccessController } from './user-module-access.controller';
import { UserModuleAccessService } from './user-module-access.service';

describe('UserModuleAccessController', () => {
  let controller: UserModuleAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserModuleAccessController],
      providers: [UserModuleAccessService],
    }).compile();

    controller = module.get<UserModuleAccessController>(UserModuleAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
