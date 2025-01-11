import { Injectable } from '@nestjs/common';
import { CreateMemberStatusDto } from './dto/create-member-status.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';

@Injectable()
export class MemberStatusService {
  create(createMemberStatusDto: CreateMemberStatusDto) {
    return 'This action adds a new memberStatus';
  }

  findAll() {
    return `This action returns all memberStatus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} memberStatus`;
  }

  update(id: number, updateMemberStatusDto: UpdateMemberStatusDto) {
    return `This action updates a #${id} memberStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} memberStatus`;
  }
}
