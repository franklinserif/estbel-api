import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ScheduleService } from './schedule.service';
import { JobsService } from '@events/jobs.service';
import { Event } from '@events/entities/event.entity';
import { EnumEvent } from '@events/enum/event';
import { EventUtils } from '@shared/libs/event';
import { JobInfo } from '@common/interfaces/schedule';
import { CronJob } from 'cron';

describe('ScheduleService', () => {
  let scheduleService: ScheduleService;
  let jobsService: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: JobsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    scheduleService = module.get<ScheduleService>(ScheduleService);
    jobsService = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(scheduleService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cron jobs with their names and next invocation times', () => {
      const mockCronJobs = new Map<string, CronJob<null, null>>();
      const mockCronJob1 = {
        nextDate: () => new Date('2023-10-01T00:00:00Z'),
      } as unknown as CronJob<null, null>;
      const mockCronJob2 = {
        nextDate: () => new Date('2023-10-02T00:00:00Z'),
      } as unknown as CronJob<null, null>;

      mockCronJobs.set('job1', mockCronJob1);
      mockCronJobs.set('job2', mockCronJob2);

      jest.spyOn(jobsService, 'findAll').mockReturnValue(mockCronJobs);

      const result = scheduleService.findAll();

      expect(result).toEqual([
        { name: 'job1', nextInvocation: expect.any(String) },
        { name: 'job2', nextInvocation: expect.any(String) },
      ]);
    });
  });

  describe('addCronJobs', () => {
    it('should schedule cron jobs for each event', () => {
      const mockEvents = [
        {
          id: '1',
          name: 'Event 1',
          description: 'This is event 1',
          address: '123 Main St',
          location: 'New York',
          repeat: true,
          startTime: new Date('2023-10-01T10:00:00Z'),
          endTime: new Date('2023-10-01T12:00:00Z'),
        },
        {
          id: '2',
          name: 'Event 2',
          description: 'This is event 2',
          address: '456 Elm St',
          location: 'Los Angeles',
          repeat: false,
          startTime: new Date('2023-10-02T14:00:00Z'),
          endTime: new Date('2023-10-02T16:00:00Z'),
        },
      ];

      jest
        .spyOn(scheduleService, 'scheduleEvent')
        .mockImplementation(() => ({}) as JobInfo);

      scheduleService.addCronJobs(mockEvents as Event[]);

      expect(scheduleService.scheduleEvent).toHaveBeenCalledTimes(
        mockEvents.length,
      );
      expect(scheduleService.scheduleEvent).toHaveBeenCalledWith(mockEvents[0]);
      expect(scheduleService.scheduleEvent).toHaveBeenCalledWith(mockEvents[1]);
    });
  });

  describe('scheduleEvent', () => {
    it('should create and return job information for start and end events', () => {
      const mockEvent = {
        id: '1',
        name: 'Event 1',
        description: 'This is event 1',
        address: '123 Main St',
        location: 'New York',
        repeat: true,
        startTime: new Date('2023-10-01T10:00:00Z'),
        endTime: new Date('2023-10-01T12:00:00Z'),
      };

      const mockStartJob = {
        id: 'startJobId',
        cronJob: {
          nextDate: () => new Date('2023-10-01T10:00:00Z'),
        } as unknown as CronJob<null, null>,
        cronExpression: '0 0 * * *',
      };
      const mockEndJob = {
        id: 'endJobId',
        cronJob: {
          nextDate: () => new Date('2023-10-01T12:00:00Z'),
        } as unknown as CronJob<null, null>,
        cronExpression: '0 1 * * *',
      };

      jest
        .spyOn(jobsService, 'create')
        .mockReturnValueOnce(mockStartJob)
        .mockReturnValueOnce(mockEndJob);

      const result = scheduleService.scheduleEvent(mockEvent as Event);

      expect(result).toEqual({
        start: { cronExpression: '0 0 * * *', jobKey: 'startJobId' },
        end: { cronExpression: '0 1 * * *', jobKey: 'endJobId' },
      });
      expect(jobsService.create).toHaveBeenCalledWith(
        EnumEvent.EVENT_START,
        mockEvent,
      );
      expect(jobsService.create).toHaveBeenCalledWith(
        EnumEvent.EVENT_END,
        mockEvent,
      );
    });
  });

  describe('cancelEvent', () => {
    it('should cancel the cron jobs for the given event', () => {
      const mockEvent = {
        id: '1',
        name: 'Event 1',
        description: 'This is event 1',
        address: '123 Main St',
        location: 'New York',
        repeat: true,
        startTime: new Date('2023-10-01T10:00:00Z'),
        endTime: new Date('2023-10-01T12:00:00Z'),
      };

      const mockJobStartId = 'startJobId';
      const mockJobEndId = 'endJobId';

      jest
        .spyOn(EventUtils, 'getEventId')
        .mockReturnValueOnce(mockJobStartId)
        .mockReturnValueOnce(mockJobEndId);
      jest.spyOn(jobsService, 'remove').mockImplementation(() => {});

      scheduleService.cancelEvent(mockEvent as Event);

      expect(EventUtils.getEventId).toHaveBeenCalledWith(
        mockEvent,
        EnumEvent.EVENT_START,
      );
      expect(EventUtils.getEventId).toHaveBeenCalledWith(
        mockEvent,
        EnumEvent.EVENT_END,
      );
      expect(jobsService.remove).toHaveBeenCalledWith(mockJobStartId);
      expect(jobsService.remove).toHaveBeenCalledWith(mockJobEndId);
    });
  });
});
