import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupService: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const group = this.groupService.create(createGroupDto);
    return await this.groupService.save(group);
  }

  async findAll(queryParams: IQueryParams) {
    const groups = await this.groupService.find(queryParams);

    return groups;
  }

  async findOne(id: string) {
    const group = await this.groupService.findOne({ where: { id } });

    if (!group?.id) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    await this.findOne(id);

    return await this.groupService.update(id, updateGroupDto);
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.groupService.delete(id);
  }
}
