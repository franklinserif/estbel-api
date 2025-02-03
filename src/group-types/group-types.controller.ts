import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupTypesService } from './group-types.service';
import { CreateGroupTypesDto } from './dto/create-group-types.dto';
import { UpdateGroupTypesDto } from './dto/update-group-types.dto';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';
import { DeleteResult } from 'typeorm';
import { GroupType } from './entities/group-types.entity';

@Controller('group-types')
export class GroupTypesController {
  constructor(private readonly groupTypesService: GroupTypesService) {}

  /**
   * Creates a new group type.
   * @param {CreateGroupTypesDto} createGroupTypesDto - The data to create a new group type.
   * @returns {Promise<GroupType>} - The created group type.
   */
  @Post()
  create(@Body() createGroupTypesDto: CreateGroupTypesDto): Promise<GroupType> {
    return this.groupTypesService.create(createGroupTypesDto);
  }

  /**
   * Retrieves all group types based on the provided query parameters.
   * @param {IQueryParams} queryParams - The query parameters for filtering.
   * @returns {Promise<GroupType[]>} - A list of group types.
   */
  @Get()
  findAll(@QueryParams() queryParams: IQueryParams): Promise<GroupType[]> {
    return this.groupTypesService.findAll(queryParams);
  }

  /**
   * Retrieves a single group type by its ID.
   * @param {string} id - The ID of the group type to retrieve.
   * @returns {Promise<GroupType>} - The found group type.
   * @throws {NotFoundException} - If the group type with the specified ID is not found.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<GroupType> {
    return this.groupTypesService.findOne(id);
  }

  /**
   * Updates a group type by its ID.
   * @param {string} id - The ID of the group type to update.
   * @param {UpdateGroupTypesDto} updateGroupTypesDto - The data to update the group type.
   * @returns {Promise<GroupType>} - The updated group type.
   * @throws {NotFoundException} - If the group type with the specified ID is not found.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupTypesDto: UpdateGroupTypesDto,
  ): Promise<GroupType> {
    return this.groupTypesService.update(id, updateGroupTypesDto);
  }

  /**
   * Deletes a group type by its ID.
   * @param {string} id - The ID of the group type to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the group type with the specified ID is not found.
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.groupTypesService.remove(id);
  }
}
