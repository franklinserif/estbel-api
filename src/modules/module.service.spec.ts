import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v4 as uui } from 'uuid';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { CreateModuleDto } from './dto/create-module.dto';

export const MODULES = [
  { name: 'users', description: 'Lorem Ipsum is simply dummy text' },
  { name: 'modules', description: 'Lorem Ipsum is simply dummy text' },
  { name: 'members', description: 'Lorem Ipsum is simply dummy text' },
  { name: 'events', description: 'Lorem Ipsum is simply dummy text' },
  { name: 'groups', description: 'Lorem Ipsum is simply dummy text' },
];

describe('ModulesService', () => {
  let modulesService: ModulesService;

  const mockModuleRepository = {
    create: jest.fn().mockImplementation((dto: CreateModuleDto) => ({
      ...dto,
    })),

    save: jest.fn().mockImplementation((dto: CreateModuleDto) =>
      Promise.resolve({
        id: uui(),
        ...dto,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      }),
    ),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ModulesService,
        {
          provide: getRepositoryToken(Module),
          useValue: mockModuleRepository,
        },
      ],
    }).compile();

    modulesService = await moduleRef.resolve(ModulesService);
  });

  it('should return a list of modules', async () => {});

  it('should create a module', async () => {
    const spyCreate = jest.spyOn(modulesService, 'create');
    const instantiatedModule = await modulesService.create(MODULES[0]);

    expect(spyCreate).toHaveBeenCalled();
    expect(spyCreate).toHaveBeenCalledWith(MODULES[0]);
    expect(instantiatedModule).toEqual({
      id: expect.any(String),
      ...MODULES[0],
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
