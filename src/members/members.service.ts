import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { In, Repository } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const member = this.memberRepository.create(createMemberDto);

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
    const member = await this.findOne(id);

    await this.memberRepository.update(id, member);
    return member;
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.memberRepository.delete(id);
  }
}
