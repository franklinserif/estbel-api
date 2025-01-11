import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberStatusDto } from './dto/create-member-status.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberStatus } from './entities/member-status.entity';
import { Repository } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class MemberStatusService {
  constructor(
    @InjectRepository(MemberStatus)
    private readonly memberStatuService: Repository<MemberStatus>,
  ) {}

  async create(createMemberStatusDto: CreateMemberStatusDto) {
    const memberStatus = this.memberStatuService.create(createMemberStatusDto);

    return await this.memberStatuService.save(memberStatus);
  }

  async findAll(queryParams: IQueryParams) {
    const memberStatus = await this.memberStatuService.find(queryParams);
    return memberStatus;
  }

  async findOne(id: string) {
    const memberStatus = await this.memberStatuService.findOne({
      where: { id },
    });

    if (!memberStatus?.id) {
      throw new NotFoundException(`member status with id :${id} not found`);
    }

    return memberStatus;
  }

  async update(id: string, updateMemberStatusDto: UpdateMemberStatusDto) {
    await this.findOne(id);

    return await this.memberStatuService.update(id, updateMemberStatusDto);
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.memberStatuService.delete(id);
  }
}
