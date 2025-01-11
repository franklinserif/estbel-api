import { Test, TestingModule } from '@nestjs/testing';
import { MemberStatusService } from './member-status.service';

describe('MemberStatusService', () => {
  let service: MemberStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberStatusService],
    }).compile();

    service = module.get<MemberStatusService>(MemberStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
