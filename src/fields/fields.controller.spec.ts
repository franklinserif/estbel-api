import { Test, TestingModule } from '@nestjs/testing';
import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';

describe('FieldsController', () => {
  let controller: FieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldsController],
      providers: [FieldsService],
    }).compile();

    controller = module.get<FieldsController>(FieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
