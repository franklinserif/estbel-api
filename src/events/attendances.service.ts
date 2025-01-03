import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { In, Repository } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';
import { EventsService } from './events.service';
import { Member } from '@members/entities/member.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    private readonly eventService: EventsService,
  ) {}

  async findAll(queryParams: IQueryParams) {
    const attendances = await this.attendanceRepository.find(queryParams);

    return attendances;
  }

  async registerAttendance(eventId: string, memberIds: string[]) {
    const event = await this.eventService.findOne(eventId);

    const members = await this.memberRepository.find({
      where: { id: In(memberIds) },
    });

    if (members.length !== memberIds.length) {
      throw new Error('One or more members not found');
    }

    const attendances = members.map((member) =>
      this.attendanceRepository.create({
        attended: false,
        event: event,
        Member: member,
      }),
    );

    return this.attendanceRepository.save(attendances);
  }

  async attended(id: string) {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance?.id) {
      throw new NotFoundException(`attendance with id: ${id} not found`);
    }

    if (!attendance.event.isActive) {
      throw new BadRequestException(`the event has expired`);
    }

    return await this.attendanceRepository.update(id, { attended: true });
  }

  async unattended(id: string) {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance?.id) {
      throw new NotFoundException(`attendance with id: ${id} not found`);
    }

    return await this.attendanceRepository.update(id, { attended: false });
  }

  async remove(id: string) {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance?.id) {
      throw new NotFoundException(`attendance with id: ${id} not found`);
    }

    return await this.attendanceRepository.delete(id);
  }
}
