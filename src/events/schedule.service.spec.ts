import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { JobsService } from '@events/jobs.service';
import { Event } from '@events/entities/event.entity';
import { EventUtils } from '@common/libs/event';
import { EnumEvent } from '@events/enum/event';

const mockJobsService = {
  findAll: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
};

jest.mock('@common/libs/event', () => ({
  EventUtils: {
    getEventId: jest.fn(),
  },
}));

describe('ScheduleService', () => {
  let scheduleService: ScheduleService;
  let jobsService: JobsService;

  const mockEvent: Event = {
    id: 'event-123',
    name: 'test event',
    description: 'test description',
    address: 'test address',
    location: 'test location',
    repeat: false,
    startCronExpression: '0 9 * * *',
    endCronExpression: '0 17 * * *',
    isActive: true,
    startTime: new Date('2023-01-01T09:00:00Z'),
    endTime: new Date('2023-01-01T17:00:00Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    attendances: [],
  } as Event;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        { provide: JobsService, useValue: mockJobsService },
      ],
    }).compile();

    scheduleService = module.get<ScheduleService>(ScheduleService);
    jobsService = module.get<JobsService>(JobsService);
    jest.spyOn(scheduleService['logger'], 'log');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return cron jobs with next invocation times in UTC', () => {
      const mockJob = {
        nextDate: () => new Date('2023-01-01T09:00:00Z'),
      };
      mockJobsService.findAll.mockReturnValue(
        new Map([
          [EnumEvent.EVENT_START, mockJob],
          [EnumEvent.EVENT_END, mockJob],
        ]),
      );

      const result = scheduleService.findAll();

      expect(result).toEqual([
        {
          name: EnumEvent.EVENT_START,
          nextInvocation: expect.any(String),
        },
        {
          name: EnumEvent.EVENT_END,
          nextInvocation: expect.any(String),
        },
      ]);
    });
  });

  describe('addCronJobs', () => {
    it('should schedule cron jobs for multiple events', () => {
      const events = [mockEvent, mockEvent];
      const mockImplementation = () => ({
        start: { cronExpression: '0 9 * * *', jobKey: 'mock-key' },
        end: { cronExpression: '0 17 * * *', jobKey: 'mock-key' },
      });
      jest
        .spyOn(scheduleService, 'scheduleEvent')
        .mockImplementation(mockImplementation);

      scheduleService.addCronJobs(events);

      expect(scheduleService.scheduleEvent).toHaveBeenCalledTimes(
        events.length,
      );
      events.forEach((event) => {
        expect(scheduleService.scheduleEvent).toHaveBeenCalledWith(event);
      });
    });
  });

  describe('scheduleEvent', () => {
    it('should create jobs using event cron expressions', () => {
      const mockStartJob = {
        cronExpression: mockEvent.startCronExpression,
        id: 'job-123',
      };
      const mockEndJob = {
        cronExpression: mockEvent.endCronExpression,
        id: 'job-456',
      };
      mockJobsService.create
        .mockReturnValueOnce(mockStartJob)
        .mockReturnValueOnce(mockEndJob);

      const result = scheduleService.scheduleEvent(mockEvent);

      expect(jobsService.create).toHaveBeenNthCalledWith(
        1,
        EnumEvent.EVENT_START,
        mockEvent,
      );
      expect(jobsService.create).toHaveBeenNthCalledWith(
        2,
        EnumEvent.EVENT_END,
        mockEvent,
      );
      expect(result).toEqual({
        start: {
          cronExpression: '0 9 * * *',
          jobKey: 'job-123',
        },
        end: {
          cronExpression: '0 17 * * *',
          jobKey: 'job-456',
        },
      });
    });
  });

  describe('cancelEvent', () => {
    it('should remove jobs using generated IDs and log', () => {
      const jobStartId = 'start-event-123';
      const jobEndId = 'end-event-123';
      (EventUtils.getEventId as jest.Mock)
        .mockReturnValueOnce(jobStartId)
        .mockReturnValueOnce(jobEndId);

      scheduleService.cancelEvent(mockEvent);

      expect(EventUtils.getEventId).toHaveBeenCalledWith(
        mockEvent,
        EnumEvent.EVENT_START,
      );
      expect(EventUtils.getEventId).toHaveBeenCalledWith(
        mockEvent,
        EnumEvent.EVENT_END,
      );
      expect(jobsService.remove).toHaveBeenCalledWith(jobStartId);
      expect(jobsService.remove).toHaveBeenCalledWith(jobEndId);
      expect(scheduleService['logger'].log).toHaveBeenCalledWith(
        `Repeating event ${mockEvent.id} has been canceled.`,
      );
    });
  });
});
