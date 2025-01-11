import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupTypesDto } from './dto/create-group-types.dto';
import { UpdateGroupTypesDto } from './dto/update-group-types.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupType } from './entities/group-types.entity';
import { Repository } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class GroupTypesService {
  constructor(
    @InjectRepository(GroupType)
    private readonly groupTypesService: Repository<GroupType>,
  ) {}

  async create(createGroupTypesDto: CreateGroupTypesDto) {
    const groupType = this.groupTypesService.create(createGroupTypesDto);

    return await this.groupTypesService.save(groupType);
  }

  async findAll(queryParams: IQueryParams) {
    const groupTypes = await this.groupTypesService.find(queryParams);
    return groupTypes;
  }

  async findOne(id: string) {
    const groupType = await this.groupTypesService.findOne({ where: { id } });

    if (!groupType?.id) {
      throw new NotFoundException(`group type with id: ${id} not found`);
    }

    return groupType;
  }

  async update(id: string, updateGroupTypesDto: UpdateGroupTypesDto) {
    await this.findOne(id);

    return await this.groupTypesService.update(id, updateGroupTypesDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.groupTypesService.delete(id);
  }
}
