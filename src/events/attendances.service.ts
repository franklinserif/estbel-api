import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';
import { EventsService } from './events.service';
import { MembersService } from '@members/members.service';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,

    private readonly eventService: EventsService,

    private readonly membersService: MembersService,
  ) {}

  /**
   * Retrieves all attendances based on the provided query parameters.
   * @param {IQueryParams} queryParams - The query parameters for filtering attendances.
   * @returns {Promise<Attendance[]>} A list of attendances.
   */
  async findAll(queryParams: IQueryParams): Promise<Attendance[]> {
    return await this.attendanceRepository.find(queryParams);
  }

  /**
   * Registers attendance for a specific event and members.
   * @param {string} eventId - The ID of the event to register attendance for.
   * @param {string[]} memberIds - The IDs of the members to register.
   * @returns {Promise<Attendance[]>} The created attendance records.
   * @throws {NotFoundException} If the event or one or more members are not found.
   */
  async registerAttendance(
    eventId: string,
    memberIds: string[],
  ): Promise<Attendance[]> {
    const event = await this.eventService.findOne(eventId);

    const members = await this.membersService.findMembersByIds(memberIds);

    if (members.length !== memberIds.length) {
      throw new NotFoundException('One or more members not found');
    }

    const attendances = members.map((member) =>
      this.attendanceRepository.create({
        attended: false,
        event: event,
        Member: member,
      }),
    );

    return await this.attendanceRepository.save(attendances);
  }

  /**
   * Confirms attendance for a specific attendance record.
   * @param {string} id - The ID of the attendance record to confirm.
   * @returns {Promise<void>} The result of the update operation.
   * @throws {NotFoundException} If the attendance record is not found.
   * @throws {BadRequestException} If the event associated with the attendance has expired.
   */
  async attended(id: string): Promise<UpdateResult> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance?.id) {
      throw new NotFoundException(`Attendance with id: ${id} not found`);
    }

    if (!attendance.event.isActive) {
      throw new BadRequestException('The event has expired');
    }

    return await this.attendanceRepository.update(id, { attended: true });
  }

  /**
   * Marks a specific attendance record as non-attendance.
   * @param {string} id - The ID of the attendance record to mark as non-attendance.
   * @returns {Promise<void>} The result of the update operation.
   * @throws {NotFoundException} If the attendance record is not found.
   */
  async unattended(id: string): Promise<UpdateResult> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance?.id) {
      throw new NotFoundException(`Attendance with id: ${id} not found`);
    }

    return await this.attendanceRepository.update(id, { attended: false });
  }

  /**
   * Removes a specific attendance record.
   * @param {string} id - The ID of the attendance record to remove.
   * @returns {Promise<void>} The result of the deletion.
   * @throws {NotFoundException} If the attendance record is not found.
   */
  async remove(id: string): Promise<DeleteResult> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance?.id) {
      throw new NotFoundException(`Attendance with id: ${id} not found`);
    }

    return await this.attendanceRepository.delete(id);
  }
}
