import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { In, Repository } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';
import { MemberStatus } from '@memberStatus/entities/member-status.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(MemberStatus)
    private readonly memberStatusRepository: Repository<MemberStatus>,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const { memberStatusId, spouseId, childIds, parentIds, ...memberData } =
      createMemberDto;

    const memberStatus = await this.memberStatusRepository.findOne({
      where: { id: memberStatusId },
    });

    if (!memberStatus?.id) {
      throw new NotFoundException(
        `member status with id: ${memberStatusId} not found`,
      );
    }

    const member = this.memberRepository.create({
      ...memberData,
      membersStatus: [memberStatus],
    });

    if (spouseId) {
      member.spouse = await this.memberRepository.findOne({
        where: { id: spouseId },
      });
    }

    if (parentIds) {
      member.parents = await this.memberRepository.findBy({
        id: In(parentIds),
      });
    }

    if (childIds) {
      member.children = await this.memberRepository.findBy({
        id: In(childIds),
      });
    }

    return await this.memberRepository.save(member);
  }

  async findAll(queryParams: IQueryParams) {
    return await this.memberRepository.find(queryParams);
  }

  async findOne(id: string) {
    const member = await this.memberRepository.findOne({ where: { id } });

    if (!member?.id) {
      throw new NotFoundException(`member with id: ${id} not found`);
    }

    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    await this.findOne(id);

    const { memberStatusId } = updateMemberDto;

    const memberStatus = await this.memberStatusRepository.findOne({
      where: { id: memberStatusId },
    });

    if (!memberStatus?.id) {
      throw new NotFoundException(
        `member status with id: ${memberStatusId} not found`,
      );
    }

    updateMemberDto.membersStatus = [
      memberStatus,
      ...updateMemberDto.membersStatus,
    ];

    return await this.memberRepository.update(id, updateMemberDto);
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.memberRepository.delete(id);
  }
}
