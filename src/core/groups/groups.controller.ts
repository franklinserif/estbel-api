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
import { DeleteResult } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { Authorization } from '@common/guards/Authorization.guard';
import { AuthPermission } from '@common/decorators/auth-permission.decorator';
import { MODULES } from '@shared/enums/modules';
import { PERMISSIONS } from '@shared/enums/permissions';
import { GroupsService } from '@groups/groups.service';
import { CreateGroupDto } from '@groups/dto/create-group.dto';
import { UpdateGroupDto } from '@groups/dto/update-group.dto';
import { Group } from '@groups/entities/group.entity';

@Controller('groups')
@UseGuards(Authorization)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  /**
   * Creates a new group.
   * @param {CreateGroupDto} createGroupDto - Data transfer object for creating a group.
   * @returns {Promise<any>} The created group.
   */
  @Post()
  @AuthPermission(MODULES.GROUPS, PERMISSIONS.CREATE)
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  /**
   * Retrieves all groups with optional query parameters.
   * @param {IQueryParams} queryParams - Query parameters for filtering or pagination.
   * @returns {Promise<any>} List of groups.
   */
  @Get()
  @AuthPermission(MODULES.GROUPS, PERMISSIONS.READ)
  findAll(@QueryParams(Group) queryParams: IQueryParams): Promise<Group[]> {
    return this.groupsService.findAll(queryParams);
  }

  /**
   * Retrieves a single group by ID.
   * @param {string} id - The ID of the group.
   * @returns {Promise<any>} The requested group.
   */
  @Get(':id')
  @AuthPermission(MODULES.GROUPS, PERMISSIONS.READ)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Group> {
    return this.groupsService.findOne(id);
  }

  /**
   * Updates an existing group by ID.
   * @param {string} id - The ID of the group.
   * @param {UpdateGroupDto} updateGroupDto - Data transfer object for updating a group.
   * @returns {Promise<any>} The updated group.
   */
  @Patch(':id')
  @AuthPermission(MODULES.GROUPS, PERMISSIONS.EDIT)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    return this.groupsService.update(id, updateGroupDto);
  }

  /**
   * Deletes a group by ID.
   * @param {string} id - The ID of the group to delete.
   * @returns {Promise<any>} The deletion result.
   */
  @Delete(':id')
  @AuthPermission(MODULES.GROUPS, PERMISSIONS.DELETE)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.groupsService.remove(id);
  }
}
