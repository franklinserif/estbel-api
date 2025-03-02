import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { MembersService } from '@members/members.service';
import { CreateMemberDto } from '@members/dto/create-member.dto';
import { UpdateMemberDto } from '@members/dto/update-member.dto';
import { Member } from '@members/entities/member.entity';
import { Authorization } from '@common/guards/Authorization.guard';
import { AuthPermission } from '@common/decorators/auth-permission.decorator';
import { PERMISSIONS } from '@shared/enums/permissions';
import { MODULES } from '@shared/enums/modules';

@Controller('members')
@UseGuards(Authorization)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  /**
   * Endpoint to create a new member.
   * @param {CreateMemberDto} createMemberDto - The data to create a new member.
   * @returns {Promise<Member>} - The created member.
   */
  @Post()
  @AuthPermission(MODULES.MEMBERS, PERMISSIONS.CREATE)
  create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.membersService.create(createMemberDto);
  }

  /**
   * Endpoint to find all members based on query parameters.
   * @param {IQueryParams} queryParams - The query parameters for fetching members.
   * @returns {Promise<Member[]>} - The list of members.
   */
  @Get()
  @AuthPermission(MODULES.MEMBERS, PERMISSIONS.READ)
  findAll(@QueryParams(Member) queryParams: IQueryParams): Promise<Member[]> {
    return this.membersService.findAll(queryParams);
  }

  /**
   * Endpoint to find a member by ID.
   * @param {string} id - The ID of the member to find.
   * @returns {Promise<Member>} - The found member.
   */
  @Get(':id')
  @AuthPermission(MODULES.MEMBERS, PERMISSIONS.READ)
  findOne(@Param('id') id: string): Promise<Member> {
    return this.membersService.findOne(id);
  }

  /**
   * Endpoint to update a member by ID.
   * @param {string} id - The ID of the member to update.
   * @param {UpdateMemberDto} updateMemberDto - The data to update the member.
   * @returns {Promise<Member>} - The updated member.
   */
  @Patch(':id')
  @AuthPermission(MODULES.MEMBERS, PERMISSIONS.EDIT)
  update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    return this.membersService.update(id, updateMemberDto);
  }

  /**
   * Endpoint to remove a member by ID.
   * @param {string} id - The ID of the member to remove.
   * @returns {Promise<void>} - A promise that resolves when the member is removed.
   */
  @Delete(':id')
  @AuthPermission(MODULES.MEMBERS, PERMISSIONS.DELETE)
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.membersService.remove(id);
  }
}
