import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberStatusDto } from './dto/create-member-status.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberStatus } from './entities/member-status.entity';
import { DeleteResult, Repository } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class MemberStatusService {
  constructor(
    @InjectRepository(MemberStatus)
    private readonly memberStatuService: Repository<MemberStatus>,
  ) {}

  /**
   * Creates a new member status.
   * @param {CreateMemberStatusDto} createMemberStatusDto - Data for creating a new member status.
   * @returns {Promise<MemberStatus>} The created member status.
   */
  async create(
    createMemberStatusDto: CreateMemberStatusDto,
  ): Promise<MemberStatus> {
    const memberStatus = this.memberStatuService.create(createMemberStatusDto);
    return await this.memberStatuService.save(memberStatus);
  }

  /**
   * Finds all member statuses based on query parameters.
   * @param {IQueryParams} queryParams - Query parameters for filtering results.
   * @returns {Promise<MemberStatus[]>} A list of member statuses.
   */
  async findAll(queryParams: IQueryParams): Promise<MemberStatus[]> {
    return await this.memberStatuService.find(queryParams);
  }

  /**
   * Finds a single member status by ID.
   * @param {string} id - The ID of the member status to find.
   * @returns {Promise<MemberStatus>} The found member status.
   * @throws {NotFoundException} If no member status is found with the given ID.
   */
  async findOne(id: string): Promise<MemberStatus> {
    const memberStatus = await this.memberStatuService.findOne({
      where: { id },
    });

    if (!memberStatus?.id) {
      throw new NotFoundException(`Member status with id: ${id} not found`);
    }

    return memberStatus;
  }

  /**
   * Updates an existing member status.
   * @param {string} id - The ID of the member status to update.
   * @param {UpdateMemberStatusDto} updateMemberStatusDto - The updated data for the member status.
   * @returns {Promise<MemberStatus>} The member status updated.
   * @throws {NotFoundException} If the member status is not found.
   */
  async update(
    id: string,
    updateMemberStatusDto: UpdateMemberStatusDto,
  ): Promise<MemberStatus> {
    await this.findOne(id);
    await this.memberStatuService.update(id, updateMemberStatusDto);

    return await this.findOne(id);
  }

  /**
   * Removes a member status by ID.
   * @param {string} id - The ID of the member status to remove.
   * @returns {Promise<DeleteResult>} A promise that resolves when the deletion is complete.
   * @throws {NotFoundException} If the member status is not found.
   */
  async remove(id: string): Promise<DeleteResult> {
    await this.findOne(id);
    return await this.memberStatuService.delete(id);
  }
}
