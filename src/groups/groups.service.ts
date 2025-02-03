import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DeleteResult } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { Member } from '@members/entities/member.entity';
import { GroupTypesService } from '@groupTypes/group-types.service';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    private readonly groupTypesService: GroupTypesService,
  ) {}

  /**
   * Creates a new group.
   * @param {CreateGroupDto} createGroupDto - The data to create the group.
   * @returns {Promise<Group>} The created group.
   */
  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const { groupTypeId, ...groupData } = createGroupDto;
    const groupType = await this.groupTypesService.findOne(groupTypeId);

    const group = this.groupRepository.create({
      ...groupData,
      groupType,
    });

    return this.groupRepository.save(group);
  }

  /**
   * Retrieves all groups based on the provided query parameters.
   * @param {IQueryParams} queryParams - The query parameters for filtering, sorting, etc.
   * @returns {Promise<Group[]>} A list of groups.
   */
  async findAll(queryParams: IQueryParams): Promise<Group[]> {
    return this.groupRepository.find(queryParams);
  }

  /**
   * Retrieves a single group by its ID with all he's members
   * @param {string} id - The ID of the group to retrieve.
   * @returns {Promise<Group>} The found group.
   * @throws {NotFoundException} If the group is not found.
   */
  async findOne(id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['members'],
    });

    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    return group;
  }

  /**
   * Updates an existing group.
   * @param {string} id - The ID of the group to update.
   * @param {UpdateGroupDto} updateGroupDto - The data to update the group.
   * @returns {Promise<Group>} The updated group.
   */
  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id);
    const { groupTypeId, membersIds, ...restUpdateGroupDto } = updateGroupDto;

    Object.assign(group, restUpdateGroupDto);

    if (groupTypeId) {
      group.groupType = await this.groupTypesService.findOne(groupTypeId);
    }

    if (membersIds) {
      group.members = await this.memberRepository.findBy({
        id: In(membersIds),
      });
    }

    return this.groupRepository.save(group);
  }

  /**
   * Removes a group by its ID.
   * @param {string} id - The ID of the group to remove.
   * @returns {Promise<void>}
   */
  async remove(id: string): Promise<DeleteResult> {
    await this.findOne(id);
    return await this.groupRepository.delete(id);
  }
}
