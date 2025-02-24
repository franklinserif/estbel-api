import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { IQueryParams } from '@common/interfaces/decorators';
import { NotFoundException } from '@nestjs/common';
import { UpdateModuleDto } from './dto/update-module.dto';
import { DeleteResult } from 'typeorm';

export const MODULES = [
  {
    name: 'users',
    description: 'Lorem Ipsum is simply dummy text',
    id: uuid(),
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  },
  {
    name: 'modules',
    description: 'Lorem Ipsum is simply dummy text',
    id: uuid(),
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  },
  {
    name: 'members',
    description: 'Lorem Ipsum is simply dummy text',
    id: uuid(),
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  },
  {
    name: 'events',
    description: 'Lorem Ipsum is simply dummy text',
    id: uuid(),
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  },
  {
    name: 'groups',
    description: 'Lorem Ipsum is simply dummy text',
    id: uuid(),
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  },
];

describe('ModulesService', () => {
  let modulesService: ModulesService;

  const mockModuleRepository = {
    create: jest.fn().mockImplementation((dto: CreateModuleDto) => ({
      ...dto,
    })),

    save: jest.fn().mockImplementation((dto: CreateModuleDto) =>
      Promise.resolve({
        id: uuid(),
        ...dto,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      }),
    ),

    find: jest.fn().mockImplementation((queryParams: IQueryParams) =>
      Promise.resolve(
        [...MODULES].filter((module) => {
          if (queryParams?.where?.name) {
            return module.name === queryParams.where?.name;
          }

          return true;
        }),
      ),
    ),

    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      const moduleFound = MODULES.find((module) => module.id === id);
      if (!moduleFound) {
        throw new NotFoundException(`Module with id: ${id} not found`);
      }
      return Promise.resolve(moduleFound);
    }),

    update: jest.fn().mockImplementation((id: string, dto: UpdateModuleDto) =>
      Promise.resolve({
        ...MODULES.find((module) => module.id === id),
        ...dto,
        updatedAt: Date.now().toString(),
      }),
    ),

    delete: jest.fn().mockImplementation(() => {
      return Promise.resolve({ raw: [], affected: 1 } as DeleteResult);
    }),
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

  it('should return a list of modules', async () => {
    const spyFindAll = jest.spyOn(modulesService, 'findAll');
    const modules = await modulesService.findAll({ where: {}, order: {} });

    expect(modules).toHaveLength(5);
    expect(spyFindAll).toHaveBeenCalled();
  });

  it('should search with queryParams an specific module', async () => {
    const spyfindAll = jest.spyOn(modulesService, 'findAll');
    const modules = await modulesService.findAll({
      where: { name: 'users' },
      order: {},
    });

    expect(spyfindAll).toHaveBeenCalled();
    expect(modules).toHaveLength(1);
    expect(modules[0]).toEqual({
      id: expect.any(String),
      ...MODULES[0],
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should create a module', async () => {
    const spyCreate = jest.spyOn(modulesService, 'create');
    const createdModule = await modulesService.create({
      name: MODULES[0].name,
      description: MODULES[0].description,
    });

    expect(spyCreate).toHaveBeenCalled();
    expect(spyCreate).toHaveBeenCalledWith({
      name: MODULES[0].name,
      description: MODULES[0].description,
    });

    expect(createdModule).toEqual({
      id: expect.any(String),
      name: MODULES[0].name,
      description: MODULES[0].description,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should find a module', async () => {
    const spyOnFindOne = jest.spyOn(modulesService, 'findOne');
    const moduleFound = await modulesService.findOne(MODULES[0].id);

    expect(spyOnFindOne).toHaveBeenCalled();
    expect(spyOnFindOne).toHaveBeenCalledWith(MODULES[0].id);
    expect(moduleFound).toEqual(MODULES[0]);

    const invalidId = '23423423xqwd';
    await expect(modulesService.findOne(invalidId)).rejects.toThrow(
      new NotFoundException(`Module with id: ${invalidId} not found`),
    );
  });

  it('should update a module', async () => {
    const spyOnUpdate = jest.spyOn(modulesService, 'update');
    const updatedModule = await modulesService.update(MODULES[0].id, {
      name: 'users module',
    });

    expect(spyOnUpdate).toHaveBeenCalled();
    expect(spyOnUpdate).toHaveBeenCalledWith(MODULES[0].id, {
      name: 'users module',
    });
    expect(updatedModule).toEqual({
      ...MODULES[0],
      updatedAt: expect.any(String),
    });

    const invalidId = '23423423xqwd';
    await expect(
      modulesService.update(invalidId, { name: 'invalid module' }),
    ).rejects.toThrow(
      new NotFoundException(`Module with id: ${invalidId} not found`),
    );
  });

  it('should return a deleteResult', async () => {
    const spyOnDelete = jest.spyOn(modulesService, 'remove');
    const deleteResult = await modulesService.remove(MODULES[0].id);

    expect(spyOnDelete).toHaveBeenCalled();
    expect(deleteResult).toEqual({ raw: [], affected: 1 });
  });
});
