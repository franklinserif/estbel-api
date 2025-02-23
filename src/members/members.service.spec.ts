import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { MemberStatusService } from '@memberStatus/member-status.service';
import { MEMBERS } from '@databases/seeds/seed/members';
import { MEMBERS_STATUS } from '@databases/seeds/seed/member-types';
import { CreateMemberDto } from './dto/create-member.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateMemberDto } from './dto/update-member.dto';

describe('MembersService', () => {
  let membersService: MembersService;

  const mockMemberRepository = {
    create: jest.fn().mockImplementation((dto: CreateMemberDto) => dto),
    save: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto })),
    find: jest.fn().mockImplementation(() => Promise.resolve(MEMBERS)),
    findOne: jest
      .fn()
      .mockImplementation(({ where: { id } }: { where: { id: string } }) => {
        const memberFound = MEMBERS.find((member) => member.id === id);

        if (!memberFound?.id)
          throw new NotFoundException(`Member with id: ${id} not found`);

        return memberFound;
      }),
    findBy: jest.fn(),
    update: jest
      .fn()
      .mockImplementation((id: string, dto: UpdateMemberDto) =>
        Promise.resolve({ ...MEMBERS[0], ...dto }),
      ),
    delete: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ raw: [], affected: 1 } as DeleteResult),
      ),
  };
  const mockMemberStatusService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest
      .fn()
      .mockImplementation(() => Promise.resolve(MEMBERS_STATUS[0])),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
        {
          provide: MemberStatusService,
          useValue: mockMemberStatusService,
        },
      ],
    }).compile();

    membersService = await moduleRef.resolve(MembersService);
  });

  it('should create a member', async () => {
    const spyOnCreate = jest.spyOn(membersService, 'create');

    const memberCreated = await membersService.create({
      ...MEMBERS[0],
      memberStatusId: 'ca474d9c-c0d2-4dff-ae71-4aa17e7eb7b4',
      birthdate: MEMBERS[0].birthdate.toString(),
      isBaptized: false,
    });

    expect(spyOnCreate).toHaveBeenCalled();
    expect(spyOnCreate).toHaveBeenCalledWith({
      ...MEMBERS[0],
      memberStatusId: 'ca474d9c-c0d2-4dff-ae71-4aa17e7eb7b4',
      birthdate: MEMBERS[0].birthdate.toString(),
      isBaptized: false,
    });

    expect(memberCreated).toEqual({
      id: expect.any(String),
      ...MEMBERS[0],
      isBaptized: false,
      birthdate: expect.any(String),
      memberStatus: MEMBERS_STATUS[0],
    });
  });

  it('should return a list of members', async () => {
    const spyOnFindAll = jest.spyOn(membersService, 'findAll');
    const members = await membersService.findAll({ where: {}, order: {} });

    expect(spyOnFindAll).toHaveBeenCalled();
    expect(spyOnFindAll).toHaveBeenCalledWith({ where: {}, order: {} });
    expect(members).toHaveLength(MEMBERS.length);
  });

  it('should find one ', async () => {
    const spyFindOne = jest.spyOn(membersService, 'findOne');
    const member = await membersService.findOne(MEMBERS[0].id);
    expect(spyFindOne).toHaveBeenCalled();
    expect(spyFindOne).toHaveBeenCalledWith(MEMBERS[0].id);

    expect(member).toEqual(MEMBERS[0]);

    await expect(membersService.findOne('1')).rejects.toThrow(
      new NotFoundException(`Member with id: 1 not found`),
    );
  });

  it('should update a member ', async () => {
    const spyOnUpdate = jest.spyOn(membersService, 'update');
    const memberUpdated = await membersService.update(MEMBERS[0].id, {
      firstName: 'Carlos',
    });
    expect(spyOnUpdate).toHaveBeenCalled();
    expect(spyOnUpdate).toHaveBeenCalledWith(MEMBERS[0].id, {
      firstName: 'Carlos',
    });

    expect(memberUpdated).toEqual({ ...MEMBERS[0], firstName: 'Carlos' });
  });

  it('should delete a member', async () => {
    const spyOnRemove = jest.spyOn(membersService, 'remove');
    const deleteResult = await membersService.remove(MEMBERS[0].id);

    expect(spyOnRemove).toHaveBeenCalled();
    expect(spyOnRemove).toHaveBeenCalledWith(MEMBERS[0].id);

    expect(deleteResult).toEqual({ raw: [], affected: 1 });
  });
});
