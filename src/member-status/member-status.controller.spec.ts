import { Test, TestingModule } from '@nestjs/testing';
import { MemberStatusController } from './member-status.controller';
import { MemberStatusService } from './member-status.service';

describe('MemberStatusController', () => {
  let controller: MemberStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberStatusController],
      providers: [MemberStatusService],
    }).compile();

    controller = module.get<MemberStatusController>(MemberStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
