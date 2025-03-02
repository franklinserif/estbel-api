import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';
import { DeleteResult } from 'typeorm';
import { GroupType } from '@groupTypes/entities/group-types.entity';
import { GroupTypesService } from '@groupTypes/group-types.service';
import { CreateGroupTypesDto } from '@groupTypes/dto/create-group-types.dto';
import { UpdateGroupTypesDto } from '@groupTypes/dto/update-group-types.dto';
import { Authorization } from '@common/guards/Authorization.guard';
import { AuthPermission } from '@common/decorators/auth-permission.decorator';
import { MODULES } from '@shared/enums/modules';
import { PERMISSIONS } from '@shared/enums/permissions';

@Controller('group-types')
@UseGuards(Authorization)
export class GroupTypesController {
  constructor(private readonly groupTypesService: GroupTypesService) {}

  /**
   * Creates a new group type.
   * @param {CreateGroupTypesDto} createGroupTypesDto - The data to create a new group type.
   * @returns {Promise<GroupType>} - The created group type.
   */
  @Post()
  @AuthPermission(MODULES.GROUPS, PERMISSIONS.CREATE)
  create(@Body() createGroupTypesDto: CreateGroupTypesDto): Promise<GroupType> {
    return this.groupTypesService.create(createGroupTypesDto);
  }

  /**
   * Retrieves all group types based on the provided query parameters.
   * @param {IQueryParams} queryParams - The query parameters for filtering.
   * @returns {Promise<GroupType[]>} - A list of group types.
   */
  @Get()
  @AuthPermission(MODULES.GROUPS, PERMISSIONS.READ)
  findAll(
    @QueryParams(GroupType) queryParams: IQueryParams,
  ): Promise<GroupType[]> {
    return this.groupTypesService.findAll(queryParams);
  }

  /**
   * Retrieves a single group type by its ID.
   * @param {string} id - The ID of the group type to retrieve.
   * @returns {Promise<GroupType>} - The found group type.
   * @throws {NotFoundException} - If the group type with the specified ID is not found.
   */
  @Get(':id')
  @AuthPermission(MODULES.GROUPS, PERMISSIONS.READ)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GroupType> {
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
  @AuthPermission(MODULES.GROUPS, PERMISSIONS.EDIT)
  update(
    @Param('id', ParseUUIDPipe) id: string,
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
  @AuthPermission(MODULES.GROUPS, PERMISSIONS.DELETE)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.groupTypesService.remove(id);
  }
}
