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
      memberStatus: memberStatus,
    });

    if (spouseId) {
      const spouse = await this.memberRepository.findOne({
        where: { id: spouseId },
      });

      if (spouse?.id) {
        throw new NotFoundException(`spouse with id ${spouseId} not found`);
      }

      member.spouse = spouse;
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
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['parents', 'children', 'spouse'],
    });

    if (!member?.id) {
      throw new NotFoundException(`member with id: ${id} not found`);
    }

    return member;
  }
  async update(id: string, updateMemberDto: UpdateMemberDto) {
    await this.findOne(id);

    const { memberStatusId, spouseId, childIds, parentIds, ...memberData } =
      updateMemberDto;

    const memberStatus = await this.memberStatusRepository.findOne({
      where: { id: memberStatusId },
    });

    if (!memberStatus?.id) {
      throw new NotFoundException(
        `Member status with id: ${memberStatusId} not found`,
      );
    }

    const member = this.memberRepository.create({
      ...memberData,
      memberStatus,
    });

    if (spouseId) {
      const spouse = await this.memberRepository.findOne({
        where: { id: spouseId },
      });

      if (!spouse?.id) {
        throw new NotFoundException(`Spouse with id ${spouseId} not found`);
      }

      member.spouse = spouse;
    }

    await this.memberRepository.update(id, member);

    const currentMember = await this.memberRepository.findOne({
      where: { id },
      relations: ['children', 'parents'],
    });

    if (parentIds) {
      const parents = await this.memberRepository.findBy({ id: In(parentIds) });
      currentMember.parents = parents;
    }

    if (childIds) {
      const children = await this.memberRepository.findBy({ id: In(childIds) });
      currentMember.children = children;
    }

    await this.memberRepository.save(currentMember);

    return currentMember;
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.memberRepository.delete(id);
  }
}
