import { Injectable } from '@nestjs/common';
import { CreateGroupTypesDto } from './dto/create-group-types.dto';
import { UpdateGroupTypesDto } from './dto/update-group-types.dto';

@Injectable()
export class GroupTypesService {
  create(createGroupTypesDto: CreateGroupTypesDto) {
    return 'This action adds a new groupsType';
  }

  findAll() {
    return `This action returns all groupsType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupsType`;
  }

  update(id: number, updateGroupTypesDto: UpdateGroupTypesDto) {
    return `This action updates a #${id} groupsType`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupsType`;
  }
}
