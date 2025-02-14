import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { EventsService } from '@events/events.service';
import { MembersService } from '@members/members.service';
import { Attendance } from '@events/entities/attendance.entity';
import { Event } from '@events/entities/event.entity';
import { Member } from '@members/entities/member.entity';
import { AttendancesService } from './attendances.service';
import { CivilStatus, Gender } from '@members/enum/options';

describe('AttendancesService', () => {
  let service: AttendancesService;
  let attendanceRepository: Repository<Attendance>;
  let eventService: EventsService;
  let membersService: MembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendancesService,
        {
          provide: getRepositoryToken(Attendance),
          useClass: Repository,
        },
        {
          provide: EventsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: MembersService,
          useValue: {
            findMembersByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
    attendanceRepository = module.get<Repository<Attendance>>(
      getRepositoryToken(Attendance),
    );
    eventService = module.get<EventsService>(EventsService);
    membersService = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of attendances', async () => {
      const result = [new Attendance()];
      jest.spyOn(attendanceRepository, 'find').mockResolvedValue(result);

      expect(await service.findAll({ where: {}, order: {} })).toEqual(result);
    });
  });

  describe('registerAttendance', () => {
    it('should register attendance for a specific event and members', async () => {
      const eventId = 'event-id';
      const memberIds = ['member-id-1', 'member-id-2'];
      const event = {
        id: eventId,
        name: 'Event Name',
        description: 'Event Description',
        address: 'Event Address',
        location: 'Event Location',
        repeat: false,
        startCronExpression: null,
        endCronExpression: null,
        isActive: true,
        startTime: new Date(),
        endTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        attendances: [],
      };
      const members = [
        {
          id: 'member-id-1',
          firstName: 'John',
          lastName: 'Doe',
          gender: Gender.MALE,
          phone: '123456789',
          birthdate: '1990-01-01',
          email: 'john.doe@example.com',
          country: 'Country',
          city: 'City',
          location: 'Location',
          zone: 'Zone',
          address: 'Address',
          howTheyArrived: 'How They Arrived',
          isBaptized: false,
          baptizedAt: null,
          baptizedChurch: null,
          civilStatus: CivilStatus.SINGLE,
          weddingAt: null,
          firstVisitAt: null,
          parents: [],
          children: [],
          spouse: null,
          groupsLeader: [],
          groups: [],
          memberStatus: null,
          attendances: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'member-id-2',
          firstName: 'Jane',
          lastName: 'Doe',
          gender: Gender.FEMALE,
          phone: '987654321',
          birthdate: '1995-01-01',
          email: 'jane.doe@example.com',
          country: 'Country',
          city: 'City',
          location: 'Location',
          zone: 'Zone',
          address: 'Address',
          howTheyArrived: 'How They Arrived',
          isBaptized: false,
          baptizedAt: null,
          baptizedChurch: null,
          civilStatus: CivilStatus.SINGLE,
          weddingAt: null,
          firstVisitAt: null,
          parents: [],
          children: [],
          spouse: null,
          groupsLeader: [],
          groups: [],
          memberStatus: null,
          attendances: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const attendances = members.map((member) => ({
        id: 'attendance-id',
        attended: false,
        event,
        Member: member,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      jest.spyOn(eventService, 'findOne').mockResolvedValue(event as Event);
      jest
        .spyOn(membersService, 'findMembersByIds')
        .mockResolvedValue(members as Member[]);
      jest
        .spyOn(attendanceRepository, 'create')
        .mockImplementation((attendance) => attendance as Attendance);
      jest
        .spyOn(attendanceRepository, 'save')
        .mockResolvedValue(attendances as any);

      expect(await service.registerAttendance(eventId, memberIds)).toEqual(
        attendances,
      );
    });

    it('should throw NotFoundException if one or more members are not found', async () => {
      const eventId = 'event-id';
      const memberIds = ['member-id-1', 'member-id-2'];
      const event = {
        id: eventId,
        name: 'Event Name',
        description: 'Event Description',
        address: 'Event Address',
        location: 'Event Location',
        repeat: false,
        startCronExpression: null,
        endCronExpression: null,
        isActive: true,
        startTime: new Date(),
        endTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        attendances: [],
      };
      const members = [
        {
          id: 'member-id-1',
          firstName: 'John',
          lastName: 'Doe',
          gender: Gender.MALE,
          phone: '123456789',
          birthdate: '1990-01-01',
          email: 'john.doe@example.com',
          country: 'Country',
          city: 'City',
          location: 'Location',
          zone: 'Zone',
          address: 'Address',
          howTheyArrived: 'How They Arrived',
          isBaptized: false,
          baptizedAt: null,
          baptizedChurch: null,
          civilStatus: CivilStatus.MARRIED,
          weddingAt: null,
          firstVisitAt: null,
          parents: [],
          children: [],
          spouse: null,
          groupsLeader: [],
          groups: [],
          memberStatus: null,
          attendances: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(eventService, 'findOne').mockResolvedValue(event as Event);
      jest
        .spyOn(membersService, 'findMembersByIds')
        .mockResolvedValue(members as Member[]);

      await expect(
        service.registerAttendance(eventId, memberIds),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('attended', () => {
    it('should confirm attendance for a specific attendance record', async () => {
      const id = 'attendance-id';
      const event = {
        id: 'event-id',
        name: 'Event Name',
        description: 'Event Description',
        address: 'Event Address',
        location: 'Event Location',
        repeat: false,
        startCronExpression: null,
        endCronExpression: null,
        isActive: true,
        startTime: new Date(),
        endTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        attendances: [],
      };
      const member = {
        id: 'member-id',
        firstName: 'John',
        lastName: 'Doe',
        gender: Gender.MALE,
        phone: '123456789',
        birthdate: '1990-01-01',
        email: 'john.doe@example.com',
        country: 'Country',
        city: 'City',
        location: 'Location',
        zone: 'Zone',
        address: 'Address',
        howTheyArrived: 'How They Arrived',
        isBaptized: false,
        baptizedAt: null,
        baptizedChurch: null,
        civilStatus: CivilStatus.SINGLE,
        weddingAt: null,
        firstVisitAt: null,
        parents: [],
        children: [],
        spouse: null,
        groupsLeader: [],
        groups: [],
        memberStatus: null,
        attendances: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const attendance: Attendance = {
        id,
        attended: false,
        event: event as Event,
        Member: member as Member,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updateResult = { affected: 1, raw: {} };

      jest.spyOn(attendanceRepository, 'findOne').mockResolvedValue(attendance);
      jest
        .spyOn(attendanceRepository, 'update')
        .mockResolvedValue(updateResult as UpdateResult);

      expect(await service.attended(id)).toEqual(updateResult);
    });

    it('should throw NotFoundException if the attendance record is not found', async () => {
      const id = 'attendance-id';

      jest.spyOn(attendanceRepository, 'findOne').mockResolvedValue(null);

      await expect(service.attended(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if the event associated with the attendance has expired', async () => {
      const id = 'attendance-id';
      const event = {
        id: 'event-id',
        name: 'Event Name',
        description: 'Event Description',
        address: 'Event Address',
        location: 'Event Location',
        repeat: false,
        startCronExpression: null,
        endCronExpression: null,
        isActive: false,
        startTime: new Date(),
        endTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        attendances: [],
      };
      const member = {
        id: 'member-id',
        firstName: 'John',
        lastName: 'Doe',
        gender: Gender.MALE,
        phone: '123456789',
        birthdate: '1990-01-01',
        email: 'john.doe@example.com',
        country: 'Country',
        city: 'City',
        location: 'Location',
        zone: 'Zone',
        address: 'Address',
        howTheyArrived: 'How They Arrived',
        isBaptized: false,
        baptizedAt: null,
        baptizedChurch: null,
        civilStatus: CivilStatus.SINGLE,
        weddingAt: null,
        firstVisitAt: null,
        parents: [],
        children: [],
        spouse: null,
        groupsLeader: [],
        groups: [],
        memberStatus: null,
        attendances: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const attendance: Attendance = {
        id,
        attended: false,
        event: event as Event,
        Member: member as Member,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(attendanceRepository, 'findOne').mockResolvedValue(attendance);

      await expect(service.attended(id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('unattended', () => {
    it('should mark a specific attendance record as non-attendance', async () => {
      const id = 'attendance-id';
      const event = {
        id: 'event-id',
        name: 'Event Name',
        description: 'Event Description',
        address: 'Event Address',
        location: 'Event Location',
        repeat: false,
        startCronExpression: null,
        endCronExpression: null,
        isActive: true,
        startTime: new Date(),
        endTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        attendances: [],
      };
      const member = {
        id: 'member-id',
        firstName: 'John',
        lastName: 'Doe',
        gender: Gender.MALE,
        phone: '123456789',
        birthdate: '1990-01-01',
        email: 'john.doe@example.com',
        country: 'Country',
        city: 'City',
        location: 'Location',
        zone: 'Zone',
        address: 'Address',
        howTheyArrived: 'How They Arrived',
        isBaptized: false,
        baptizedAt: null,
        baptizedChurch: null,
        civilStatus: CivilStatus.SINGLE,
        weddingAt: null,
        firstVisitAt: null,
        parents: [],
        children: [],
        spouse: null,
        groupsLeader: [],
        groups: [],
        memberStatus: null,
        attendances: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const attendance: Attendance = {
        id,
        attended: true,
        event: event as Event,
        Member: member as Member,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updateResult = { affected: 1, raw: {} };

      jest.spyOn(attendanceRepository, 'findOne').mockResolvedValue(attendance);
      jest
        .spyOn(attendanceRepository, 'update')
        .mockResolvedValue(updateResult as UpdateResult);

      expect(await service.unattended(id)).toEqual(updateResult);
    });

    it('should throw NotFoundException if the attendance record is not found', async () => {
      const id = 'attendance-id';

      jest.spyOn(attendanceRepository, 'findOne').mockResolvedValue(null);

      await expect(service.unattended(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a specific attendance record', async () => {
      const id = 'attendance-id';
      const event = {
        id: 'event-id',
        name: 'Event Name',
        description: 'Event Description',
        address: 'Event Address',
        location: 'Event Location',
        repeat: false,
        startCronExpression: null,
        endCronExpression: null,
        isActive: true,
        startTime: new Date(),
        endTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        attendances: [],
      };
      const member = {
        id: 'member-id',
        firstName: 'John',
        lastName: 'Doe',
        gender: Gender.MALE,
        phone: '123456789',
        birthdate: '1990-01-01',
        email: 'john.doe@example.com',
        country: 'Country',
        city: 'City',
        location: 'Location',
        zone: 'Zone',
        address: 'Address',
        howTheyArrived: 'How They Arrived',
        isBaptized: false,
        baptizedAt: null,
        baptizedChurch: null,
        civilStatus: CivilStatus.SINGLE,
        weddingAt: null,
        firstVisitAt: null,
        parents: [],
        children: [],
        spouse: null,
        groupsLeader: [],
        groups: [],
        memberStatus: null,
        attendances: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const attendance: Attendance = {
        id,
        attended: true,
        event: event as Event,
        Member: member as Member,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const deleteResult: DeleteResult = { affected: 1, raw: {} };

      jest.spyOn(attendanceRepository, 'findOne').mockResolvedValue(attendance);
      jest
        .spyOn(attendanceRepository, 'delete')
        .mockResolvedValue(deleteResult);

      expect(await service.remove(id)).toEqual(deleteResult);
    });

    it('should throw NotFoundException if the attendance record is not found', async () => {
      const id = 'attendance-id';

      jest.spyOn(attendanceRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
