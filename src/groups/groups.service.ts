import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';
import { GroupType } from '@groupTypes/entities/group-types.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupService: Repository<Group>,

    @InjectRepository(GroupType)
    private readonly groupTypeService: Repository<GroupType>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const { groupTypeId } = createGroupDto;

    const groupType = await this.groupTypeService.findOne({
      where: { id: groupTypeId },
    });

    if (!groupType?.id) {
      throw new NotFoundException(`GroupType with id ${groupTypeId} not found`);
    }

    const group = this.groupService.create({
      ...createGroupDto,
      groupTypes: groupType,
    });

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

    const { groupTypeId, ...restUpdateGroupDto } = updateGroupDto;

    if (groupTypeId) {
      const groupType = await this.groupTypeService.findOne({
        where: { id: groupTypeId },
      });

      if (!groupType?.id) {
        throw new NotFoundException(
          `GroupType with id ${groupTypeId} not found`,
        );
      }

      restUpdateGroupDto.groupTypes = groupType;
    }

    return await this.groupService.update(id, restUpdateGroupDto);
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.groupService.delete(id);
  }
}
