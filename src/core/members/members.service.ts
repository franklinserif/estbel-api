import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { MemberStatusService } from '@memberStatus/member-status.service';
import { IQueryParams } from '@common/interfaces/decorators';
import { Member } from '@members/entities/member.entity';
import { CivilStatus } from '@members/enum/options';
import { CreateMemberDto } from '@members/dto/create-member.dto';
import { UpdateMemberDto } from '@members/dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    private readonly memberStatusService: MemberStatusService,
  ) {}

  /**
   * Creates a new member and saves it in the database.
   * @param {CreateMemberDto} createMemberDto - the data transfer object for creating a member.
   * @returns {CreateMemberDto} the created member.
   */
  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const { memberStatusId, spouseId, childIds, parentIds, ...memberData } =
      createMemberDto;

    const member = this.memberRepository.create(memberData);

    member.memberStatus =
      await this.memberStatusService.findOne(memberStatusId);

    if (spouseId) {
      member.spouse = await this.findMember(spouseId, 'Spouse');
    }

    if (parentIds) {
      member.parents = await this.findMembersByIds(parentIds);
    }

    if (childIds) {
      member.children = await this.findMembersByIds(childIds);
    }

    return this.memberRepository.save(member);
  }

  /**
   * Finds all members based on query parameters.
   * @param {IQueryParams} queryParams - Query parameters for filtering and sorting members.
   * @returns {Promise<Member>} An array of the members.
   */
  async findAll(queryParams: IQueryParams): Promise<Member[]> {
    return this.memberRepository.find(queryParams);
  }

  /**
   * Retrieves all the members that match the provided query parameters.
   * @param {string} id - The ID of the member to retrieve.
   */
  async findOne(id: string): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['parents', 'children', 'spouse'],
    });

    if (!member) {
      throw new NotFoundException(`Member with id: ${id} not found`);
    }

    return member;
  }

  /**
   * Updates an existing module by its ID
   * @param {string} id - The ID of the member to update
   * @param {UpdateMemberDto} updateMemberDto - the data transfer object for update a member.
   * @throws {NotFoundException} if no member with the given ID is found.
   * @returns {Promise<Member>} The result of the update operation.
   */
  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);

    const { memberStatusId, spouseId, childIds, parentIds, ...memberData } =
      updateMemberDto;

    Object.assign(member, memberData);

    if (memberStatusId) {
      member.memberStatus =
        await this.memberStatusService.findOne(memberStatusId);
    }

    if (spouseId) {
      member.spouse = await this.findMember(spouseId, 'Spouse');
    }

    if (member.civilStatus === CivilStatus.DIVORCED) {
      member.spouse = null;
    }

    if (parentIds) {
      member.parents = await this.findMembersByIds(parentIds);
    }

    if (childIds) {
      member.children = await this.findMembersByIds(childIds);
    }

    return this.memberRepository.save(member);
  }

  /**
   * Deletes a member by its ID.
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
   * @param {string} id - The ID of the member to retrieve.
   * @throws {NotFoundException} If no module with the given ID is found with an relation information.
   * @returns {Promise<Member>} The retrieved member
   */
  private async findMember(id: string, relation: string): Promise<Member> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`${relation} with id: ${id} not found`);
    }
    return member;
  }

  /**
   * Retrieves members that match the IDs.
   * @param {string[]} ids - The ids of the members to retrieve.
   * @returns {Promise<Member>} An array of member.
   */
  async findMembersByIds(ids: string[]): Promise<Member[]> {
    return this.memberRepository.findBy({ id: In(ids) });
  }
}
