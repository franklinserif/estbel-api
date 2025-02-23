import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MemberStatusService } from './member-status.service';
import { MemberStatus } from './entities/member-status.entity';
import { MEMBERS_STATUS } from '@databases/seeds/mock/member-types';
import { CreateMemberStatusDto } from './dto/create-member-status.dto';
import { DeleteResult } from 'typeorm';

describe('member-status', () => {
  let memberStatusService: MemberStatusService;

  const status = MEMBERS_STATUS.map((status) => ({
    ...status,
    id: uuid(),
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  }));

  const mockMemberStatusRepository = {
    find: jest
      .fn()
      .mockImplementation(({ where: {}, order: {} }) =>
        Promise.resolve(status),
      ),

    findOne: jest
      .fn()
      .mockImplementation(({ where: { id } }: { where: { id: string } }) => {
        const statuFound = status.find((statu) => statu.id === id);

        if (!statuFound?.id)
          throw new NotFoundException(`Member status with id: ${id} not found`);

        return Promise.resolve(statuFound);
      }),

    create: jest
      .fn()
      .mockImplementation((dto: CreateMemberStatusDto) => ({ ...dto })),

    save: jest.fn().mockImplementation((dto: CreateMemberStatusDto) =>
      Promise.resolve({
        ...dto,
        id: uuid(),
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      }),
    ),

    update: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ ...status[0], ...dto })),

    delete: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ raw: [], affected: 1 } as DeleteResult),
      ),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MemberStatusService,
        {
          provide: getRepositoryToken(MemberStatus),
          useValue: mockMemberStatusRepository,
        },
      ],
    }).compile();

    memberStatusService = await moduleRef.resolve(MemberStatusService);
  });

  it('should return a list of members status', async () => {
    const spyOnFindAll = jest.spyOn(memberStatusService, 'findAll');
    const status = await memberStatusService.findAll({ where: {}, order: {} });

    expect(spyOnFindAll).toHaveBeenCalled();
    expect(spyOnFindAll).toHaveBeenCalledWith({ where: {}, order: {} });

    expect(status).toHaveLength(status.length);
  });

  it('should find a status', async () => {
    const spyOnFindOne = jest.spyOn(memberStatusService, 'findOne');
    const statusFound = await memberStatusService.findOne(status[0].id);

    expect(spyOnFindOne).toHaveBeenCalled();
    expect(spyOnFindOne).toHaveBeenCalledWith(status[0].id);

    expect(statusFound).toEqual(status[0]);

    await expect(memberStatusService.findOne('1')).rejects.toThrow(
      new NotFoundException(`Member status with id: 1 not found`),
    );
  });

  it('should create a status', async () => {
    const spyOnCreate = jest.spyOn(memberStatusService, 'create');
    const statusCreated = await memberStatusService.create({
      name: 'visitas',
      description: 'personas que vienen a la iglesia pero no están bautizados',
    });

    expect(spyOnCreate).toHaveBeenCalled();
    expect(spyOnCreate).toHaveBeenCalledWith({
      name: 'visitas',
      description: 'personas que vienen a la iglesia pero no están bautizados',
    });

    expect(statusCreated).toEqual({
      id: expect.any(String),
      name: 'visitas',
      description: 'personas que vienen a la iglesia pero no están bautizados',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should update a status', async () => {
    const spyOnUpdate = jest.spyOn(memberStatusService, 'update');
    const statusUpdated = await memberStatusService.update(status[0].id, {
      name: 'bautizados',
    });

    expect(spyOnUpdate).toHaveBeenCalled();
    expect(statusUpdated).toEqual({ ...status[0] });
  });

  it('should delete a status', async () => {
    const spyOnRemove = jest.spyOn(memberStatusService, 'remove');
    const deleteResult = await memberStatusService.remove(status[0].id);

    expect(spyOnRemove).toHaveBeenCalled();
    expect(spyOnRemove).toHaveBeenCalledWith(status[0].id);
    expect(deleteResult).toEqual({ raw: [], affected: 1 });
  });
});
