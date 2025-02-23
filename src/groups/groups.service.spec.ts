import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { GroupsService } from './groups.service';
import { Group } from './entities/group.entity';
import { GROUPS } from '@databases/seeds/mock/groups';
import { GROUP_TYPES } from '@databases/seeds/mock/group-types';
import { Member } from '@members/entities/member.entity';
import { GroupTypesService } from '@groupTypes/group-types.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateGroupDto } from './dto/update-group.dto';

const groupsWithIds = GROUPS.map((group) => ({
  ...group,
  id: uuid(),
  createdAt: Date.now().toString(),
  updatedAt: Date.now().toString(),
}));

describe('GroupsService', () => {
  let groupService: GroupsService;

  const mockGroupRepository = {
    find: jest
      .fn()
      .mockImplementation(({ where: {}, order: {} }) =>
        Promise.resolve(GROUPS),
      ),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        ...dto,
        id: uuid(),
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      }),
    ),

    findOne: jest
      .fn()
      .mockImplementation(({ where: { id } }: { where: { id: string } }) => {
        const groupFound = groupsWithIds.find((group) => group.id === id);

        if (!groupFound?.id)
          throw new NotFoundException(`Group with id ${id} not found`);

        return Promise.resolve(groupFound);
      }),

    update: jest.fn().mockImplementation((id: string, dto: UpdateGroupDto) =>
      Promise.resolve({
        ...groupsWithIds[0],
        ...dto,
        updatedAt: Date.now().toString(),
      }),
    ),

    delete: jest
      .fn()
      .mockImplementation(() => Promise.resolve({ raw: [], affected: 1 })),
  };

  const mockMemberRepository = {};
  const mockGroupTypesService = {
    findOne: jest
      .fn()
      .mockImplementation(() => Promise.resolve(GROUP_TYPES[0])),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useValue: mockGroupRepository,
        },
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
        {
          provide: GroupTypesService,
          useValue: mockGroupTypesService,
        },
      ],
    }).compile();
    groupService = await moduleRef.resolve(GroupsService);
  });

  it('should return a list of groups', async () => {
    const spyOnFindAll = jest.spyOn(groupService, 'findAll');
    const groups = await groupService.findAll({ where: {}, order: {} });

    expect(spyOnFindAll).toHaveBeenCalled();
    expect(spyOnFindAll).toHaveBeenCalledWith({ where: {}, order: {} });
    expect(groups).toHaveLength(GROUPS.length);
  });

  it('should create a group', async () => {
    const spyOnCreate = jest.spyOn(groupService, 'create');
    const group = await groupService.create({
      name: 'group test',
      description: 'description test',
      groupTypeId: '123',
      location: '1244234',
    });

    expect(spyOnCreate).toHaveBeenCalled();
    expect(spyOnCreate).toHaveBeenCalledWith({
      name: 'group test',
      description: 'description test',
      groupTypeId: '123',
      location: '1244234',
    });

    expect(group).toEqual({
      id: expect.any(String),
      name: 'group test',
      description: 'description test',
      location: '1244234',
      groupType: {
        description: 'Ministerios de la iglesia',
        name: 'Ministerios',
      },
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should find one group', async () => {
    const spyOnFindOne = jest.spyOn(groupService, 'findOne');
    const group = await groupService.findOne(groupsWithIds[0].id);

    expect(spyOnFindOne).toHaveBeenCalled();
    expect(spyOnFindOne).toHaveBeenCalledWith(groupsWithIds[0].id);

    expect(group).toEqual(groupsWithIds[0]);
    await expect(groupService.findOne('1')).rejects.toThrow(
      new NotFoundException(`Group with id 1 not found`),
    );
  });

  it('should update a group', async () => {
    const spyOnUpdate = jest.spyOn(groupService, 'update');
    const groupUpdated = await groupService.update(groupsWithIds[0].id, {
      name: 'grupo 1',
    });

    expect(spyOnUpdate).toHaveBeenCalled();
    expect(groupUpdated).toEqual({
      ...groupsWithIds[0],
      name: 'grupo 1',
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('should delete a group', async () => {
    const spyOnRemove = jest.spyOn(groupService, 'remove');
    const deleteResult = await groupService.remove(groupsWithIds[0].id);

    expect(spyOnRemove).toHaveBeenCalled();
    expect(spyOnRemove).toHaveBeenCalledWith(groupsWithIds[0].id);
    expect(deleteResult).toEqual({ raw: [], affected: 1 });
  });
});
