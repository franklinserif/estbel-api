import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupType } from '@groupTypes/entities/group-types.entity';
import { IQueryParams } from '@common/interfaces/decorators';
import { CreateGroupTypesDto } from '@groupTypes/dto/create-group-types.dto';
import { UpdateGroupTypesDto } from '@groupTypes/dto/update-group-types.dto';

@Injectable()
export class GroupTypesService {
  constructor(
    @InjectRepository(GroupType)
    private readonly groupTypesRepository: Repository<GroupType>,
  ) {}

  /**
   * Creates a new group type.
   * @param {CreateGroupTypesDto} createGroupTypesDto - The data to create a new group type.
   * @returns {Promise<GroupType>} - The created group type.
   */
  async create(createGroupTypesDto: CreateGroupTypesDto): Promise<GroupType> {
    const groupType = this.groupTypesRepository.create(createGroupTypesDto);

    return await this.groupTypesRepository.save(groupType);
  }

  /**
   * Retrieves all group types based on the provided query parameters.
   * @param {IQueryParams} queryParams - The query parameters for filtering.
   * @returns {Promise<GroupType[]>} - A list of group types.
   */
  async findAll(queryParams: IQueryParams): Promise<GroupType[]> {
    return await this.groupTypesRepository.find(queryParams);
  }

  /**
   * Retrieves a single group type by its ID.
   * @param {string} id - The ID of the group type to retrieve.
   * @returns {Promise<GroupType>} - The found group type.
   * @throws {NotFoundException} - If the group type with the specified ID is not found.
   */
  async findOne(id: string): Promise<GroupType> {
    const groupType = await this.groupTypesRepository.findOne({
      where: { id },
    });

    if (!groupType?.id) {
      throw new NotFoundException(`Group type with id: ${id} not found`);
    }

    return groupType;
  }

  /**
   * Updates a group type by its ID.
   * @param {string} id - The ID of the group type to update.
   * @param {UpdateGroupTypesDto} updateGroupTypesDto - The data to update the group type.
   * @returns {Promise<GroupType>} - The updated group type.
   * @throws {NotFoundException} - If the group type with the specified ID is not found.
   */
  async update(
    id: string,
    updateGroupTypesDto: UpdateGroupTypesDto,
  ): Promise<GroupType> {
    await this.findOne(id);

    await this.groupTypesRepository.update(id, updateGroupTypesDto);

    return this.findOne(id);
  }

  /**
   * Deletes a group type by its ID.
   * @param {string} id - The ID of the group type to delete.
   * @returns {Promise<DeleteResult>} The result of the delete operation
   * @throws {NotFoundException} - If the group type with the specified ID is not found.
   */
  async remove(id: string): Promise<DeleteResult> {
    await this.findOne(id);

    return await this.groupTypesRepository.delete(id);
  }
}
