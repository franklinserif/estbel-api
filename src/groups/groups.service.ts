import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { In, Repository } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';
import { GroupType } from '@groupTypes/entities/group-types.entity';
import { Member } from '@members/entities/member.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupService: Repository<Group>,

    @InjectRepository(GroupType)
    private readonly groupTypeService: Repository<GroupType>,

    @InjectRepository(Member)

  /**
   * Creates a new group.
   *
   * @param {CreateGroupDto} createGroupDto - The data to create the group.
   * @returns {Promise<Group>} The created group.
   */
  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    }

    const group = this.groupService.create({
      ...createGroupDto,
      groupType: groupType,
    });

    return await this.groupService.save(group);
  }

  /**
   * Retrieves all groups based on the provided query parameters.
   *
   * @param {IQueryParams} queryParams - The query parameters for filtering, sorting, etc.
   * @returns {Promise<Group[]>} A list of groups.
   */
  async findAll(queryParams: IQueryParams): Promise<Group[]> {
  /**
   * Retrieves a single group by its ID.
   * @param {string} id - The ID of the group to retrieve.
   * @returns {Promise<Group>} The found group.
   * @throws {NotFoundException} If the group is not found.
   */
  async findOne(id: string): Promise<Group> {

    if (!group?.id) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    return group;
  }

  /**
   * Updates an existing group.
   *
   * @param {string} id - The ID of the group to update.
   * @param {UpdateGroupDto} updateGroupDto - The data to update the group.
   * @returns {Promise<Group>} The updated group.
   */
  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const { groupTypeId, membersIds, ...restUpdateGroupDto } = updateGroupDto;

    group = {
      ...group,
      ...restUpdateGroupDto,
    };

    if (groupTypeId) {
      const groupType = await this.groupTypeService.findOne({
        where: { id: groupTypeId },
      });

      if (!groupType?.id) {
        throw new NotFoundException(
          `GroupType with id ${groupTypeId} not found`,
        );
      }

      group.groupTypes = groupType;
    }
    await this.groupService.update(id, group);

    if (membersIds) {
      const members = await this.membersService.findBy({
        id: In(membersIds),
      });

      group.members = members;
    }

    return await this.groupService.save(group);
  }

  /**
   * Removes a group by its ID.
   *
   * @param {string} id - The ID of the group to remove.
   * @returns {Promise<void>}
   */
  async remove(id: string): Promise<void> {
  }
}
