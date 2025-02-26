import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttendancesService } from './attendances.service';
import { Attendance } from './entities/attendance.entity';
import { EventsService } from '@events/events.service';
import { MembersService } from '@members/members.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AttendancesService', () => {
  let service: AttendancesService;

  const mockAttendanceRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockEventService = {
    findOne: jest.fn(),
  };

  const mockMembersService = {
    findMembersByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendancesService,
        {
          provide: getRepositoryToken(Attendance),
          useValue: mockAttendanceRepository,
        },
        {
          provide: EventsService,
          useValue: mockEventService,
        },
        {
          provide: MembersService,
          useValue: mockMembersService,
        },
      ],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of attendances', async () => {
      const queryParams = { where: { attended: true }, order: {} };
      const attendances = [{ id: '1', attended: true }];
      mockAttendanceRepository.find.mockResolvedValue(attendances);

      const result = await service.findAll(queryParams);

      expect(result).toEqual(attendances);
      expect(mockAttendanceRepository.find).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('registerAttendance', () => {
    it('should register attendance for an event and members', async () => {
      const eventId = 'event1';
      const memberIds = ['member1', 'member2'];
      const event = { id: eventId, isActive: true };
      const members = [{ id: 'member1' }, { id: 'member2' }];
      const attendances = [
        { attended: false, event, Member: members[0] },
        { attended: false, event, Member: members[1] },
      ];

      mockEventService.findOne.mockResolvedValue(event);
      mockMembersService.findMembersByIds.mockResolvedValue(members);
      mockAttendanceRepository.create.mockImplementation(
        (attendance) => attendance,
      );
      mockAttendanceRepository.save.mockResolvedValue(attendances);

      const result = await service.registerAttendance(eventId, memberIds);

      expect(result).toEqual(attendances);
      expect(mockEventService.findOne).toHaveBeenCalledWith(eventId);
      expect(mockMembersService.findMembersByIds).toHaveBeenCalledWith(
        memberIds,
      );
      expect(mockAttendanceRepository.create).toHaveBeenCalledTimes(2);
      expect(mockAttendanceRepository.save).toHaveBeenCalledWith(attendances);
    });

    it('should throw NotFoundException if one or more members are not found', async () => {
      const eventId = 'event1';
      const memberIds = ['member1', 'member2'];
      const event = { id: eventId, isActive: true };
      const members = [{ id: 'member1' }];

      mockEventService.findOne.mockResolvedValue(event);
      mockMembersService.findMembersByIds.mockResolvedValue(members);

      await expect(
        service.registerAttendance(eventId, memberIds),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('attended', () => {
    it('should confirm attendance for a specific record', async () => {
      const id = 'attendance1';
      const attendance = { id, event: { isActive: true } };
      const updateResult = { affected: 1 };

      mockAttendanceRepository.findOne.mockResolvedValue(attendance);
      mockAttendanceRepository.update.mockResolvedValue(updateResult);

      const result = await service.attended(id);

      expect(result).toEqual(updateResult);
      expect(mockAttendanceRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockAttendanceRepository.update).toHaveBeenCalledWith(id, {
        attended: true,
      });
    });

    it('should throw NotFoundException if attendance record is not found', async () => {
      const id = 'attendance1';

      mockAttendanceRepository.findOne.mockResolvedValue(null);

      await expect(service.attended(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if the event has expired', async () => {
      const id = 'attendance1';
      const attendance = { id, event: { isActive: false } };

      mockAttendanceRepository.findOne.mockResolvedValue(attendance);

      await expect(service.attended(id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('unattended', () => {
    it('should mark attendance as non-attendance for a specific record', async () => {
      const id = 'attendance1';
      const attendance = { id };
      const updateResult = { affected: 1 };

      mockAttendanceRepository.findOne.mockResolvedValue(attendance);
      mockAttendanceRepository.update.mockResolvedValue(updateResult);

      const result = await service.unattended(id);

      expect(result).toEqual(updateResult);
      expect(mockAttendanceRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockAttendanceRepository.update).toHaveBeenCalledWith(id, {
        attended: false,
      });
    });

    it('should throw NotFoundException if attendance record is not found', async () => {
      const id = 'attendance1';

      mockAttendanceRepository.findOne.mockResolvedValue(null);

      await expect(service.unattended(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a specific attendance record', async () => {
      const id = 'attendance1';
      const attendance = { id };
      const deleteResult = { affected: 1 };

      mockAttendanceRepository.findOne.mockResolvedValue(attendance);
      mockAttendanceRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(id);

      expect(result).toEqual(deleteResult);
      expect(mockAttendanceRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockAttendanceRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if attendance record is not found', async () => {
      const id = 'attendance1';

      mockAttendanceRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
