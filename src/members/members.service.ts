import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { In, Repository } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';
import { MemberStatus } from '@memberStatus/entities/member-status.entity';
import { CivilStatus } from './enum/options';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(MemberStatus)
    private readonly memberStatusRepository: Repository<MemberStatus>,
  ) {}

  /**
   * Creates a new member and saves it in the database.
   *
   * @param {CreateMemberDto} createMemberDto - the data transfer object for creating a member.
   * @returns {CreateMemberDto} the created member.
   */
  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const { memberStatusId, spouseId, childIds, parentIds, ...memberData } =
      createMemberDto;

    const memberStatus = await this.memberStatusRepository.findOne({
      where: { id: memberStatusId },
    });

    if (!memberStatus?.id) {
      throw new NotFoundException(
        `member status with id: ${memberStatusId} not found`,
      );
    }

    const member = this.memberRepository.create({
      ...memberData,
      memberStatus: memberStatus,
    });

    if (spouseId) {
      const spouse = await this.memberRepository.findOne({
        where: { id: spouseId },
      });

      if (spouse?.id) {
        throw new NotFoundException(`spouse with id ${spouseId} not found`);
      }

      member.spouse = spouse;
      member.civilStatus =
        memberData.civilStatus === CivilStatus.WIDOWER
          ? CivilStatus.WIDOWER
          : CivilStatus.MARRIED;
    }

    if (parentIds) {
      member.parents = await this.memberRepository.findBy({
        id: In(parentIds),
      });
    }

    if (childIds) {
      member.children = await this.memberRepository.findBy({
        id: In(childIds),
      });
    }

    return await this.memberRepository.save(member);
  }

  /**
   * Finds all members based on query parameters.
   *
   * @param {IQueryParams} queryParams - Query parameters for filtering and sorting members.
   * @returns {Promise<Member>} An array of the members.
   */
  async findAll(queryParams: IQueryParams): Promise<Member[]> {

  /**
   * Retrieves all the members that match the provided query parameters.
   *
   * @param {string} id - The ID of the member to retrieve.
   */
  async findOne(id: string): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['parents', 'children', 'spouse'],
    });

    if (!member?.id) {
      throw new NotFoundException(`member with id: ${id} not found`);
    }

    return member;
  }

  /**
   * Updates an existing module by its ID
   *
   * @param {string} id - The ID of the member to update
   * @param {UpdateMemberDto} updateMemberDto - the data transfer object for update a member.
   * @throws {NotFoundException} if no member with the given ID is found.
   * @returns {Promise<Member>} The result of the update operation.
   */
  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {

    const { memberStatusId, spouseId, childIds, parentIds, ...memberData } =
      updateMemberDto;

    const memberStatus = await this.memberStatusRepository.findOne({
      where: { id: memberStatusId },
    });

    if (!memberStatus?.id) {
      throw new NotFoundException(
        `Member status with id: ${memberStatusId} not found`,
      );
    }

    const member = this.memberRepository.create({
      ...memberData,
      memberStatus,
    });

    if (spouseId) {
      const spouse = await this.memberRepository.findOne({
        where: { id: spouseId },
      });

      if (!spouse?.id) {
        throw new NotFoundException(`Spouse with id ${spouseId} not found`);
      }

      member.spouse = spouse;
      member.civilStatus =
        memberData.civilStatus === CivilStatus.WIDOWER
          ? CivilStatus.WIDOWER
          : CivilStatus.MARRIED;
    }

    if (member.civilStatus === CivilStatus.DIVORCED) {
      member.spouse = null;
    }

    await this.memberRepository.update(id, member);

    const currentMember = await this.memberRepository.findOne({
      where: { id },
      relations: ['children', 'parents'],
    });

    if (parentIds) {
      const parents = await this.memberRepository.findBy({ id: In(parentIds) });
      currentMember.parents = parents;
    }

    if (childIds) {

  /**
   * Deletes a member by its ID.
   *
   * @param {string} id - The ID of the member to delete.
   * @throws {NotFoundException} if no member with the given ID is found.
   * @returns {Promise<DeleteResult>} A promise indicating the completion of the delete operation.
   */
  async remove(id: string): Promise<DeleteResult> {
    await this.findOne(id);

    return await this.memberRepository.delete(id);
  }
  /**
   * Retrieves a single member by its ID
   *
   * @param {string} id - The ID of the member to retrieve.
   * @throws {NotFoundException} If no module with the given ID is found with an relation information.
   * @returns {Promise<Member>} The retrieved member
   */
  private async findMember(id: string, relation: string): Promise<Member> {
  /**
   * Retrieves members that match the IDs.
   *
   * @param {string[]} ids - The ids of the members to retrieve.
   * @returns {Promise<Member>} An array of member.
   */
  private async findMembersByIds(ids: string[]): Promise<Member[]> {
}
