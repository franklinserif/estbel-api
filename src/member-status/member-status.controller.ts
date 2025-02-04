import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';
import { MemberStatus } from '@memberStatus/entities/member-status.entity';
import { MemberStatusService } from '@memberStatus/member-status.service';
import { UpdateMemberStatusDto } from '@memberStatus/dto/update-member-status.dto';
import { CreateMemberStatusDto } from '@memberStatus/dto/create-member-status.dto';

@Controller('member-status')
export class MemberStatusController {
  constructor(private readonly memberStatusService: MemberStatusService) {}

  /**
   * Creates a new member status.
   * @param {CreateMemberStatusDto} createMemberStatusDto - The data to create a new member status.
   * @returns {Promise<MemberStatus>} The created member status.
   */
  @Post()
  create(
    @Body() createMemberStatusDto: CreateMemberStatusDto,
  ): Promise<MemberStatus> {
    return this.memberStatusService.create(createMemberStatusDto);
  }

  /**
   * Retrieves all member statuses with optional query parameters.
   * @param {IQueryParams} queryParams - Query parameters for filtering results.
   * @returns {Promise<MemberStatus[]>} A list of member statuses.
   */
  @Get()
  async findAll(
    @QueryParams() queryParams: IQueryParams,
  ): Promise<MemberStatus[]> {
    return this.memberStatusService.findAll(queryParams);
  }

  /**
   * Retrieves a single member status by ID.
   * @param {string} id - The ID of the member status to retrieve.
   * @returns {Promise<MemberStatus>} The requested member status.
   * @throws {NotFoundException} If the member status is not found.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<MemberStatus> {
    return this.memberStatusService.findOne(id);
  }

  /**
   * Updates an existing member status.
   * @param {string} id - The ID of the member status to update.
   * @param {UpdateMemberStatusDto} updateMemberStatusDto - The updated data for the member status.
   * @returns {Promise<MemberStatus>} the member status updated.
   * @throws {NotFoundException} If the member status is not found.
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMemberStatusDto: UpdateMemberStatusDto,
  ): Promise<MemberStatus> {
    return this.memberStatusService.update(id, updateMemberStatusDto);
  }

  /**
   * Deletes a member status by ID.
   * @param {string} id - The ID of the member status to delete.
   * @returns {Promise<DeleteResult>} A promise with the delete information.
   * @throws {NotFoundException} If the member status is not found.
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.memberStatusService.remove(id);
  }
}
