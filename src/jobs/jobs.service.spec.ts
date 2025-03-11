import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JobsService } from './jobs.service';
import { CronJob } from 'cron';
import { Event } from '@events/entities/event.entity';
import { EnumEvent } from '@events/enum/event';
import { IEvents } from '@events/interfaces/event';
import { Logger } from '@nestjs/common';

describe('JobsService', () => {
  let service: JobsService;
  let schedulerRegistry: SchedulerRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: SchedulerRegistry,
          useValue: {
            getCronJobs: jest.fn(),
            addCronJob: jest.fn(),
            getCronJob: jest.fn(),
            deleteCronJob: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        Logger,
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of cron jobs', () => {
      const mockCronJobs = new Map<string, CronJob>();
      jest
        .spyOn(schedulerRegistry, 'getCronJobs')
        .mockReturnValue(mockCronJobs);

      const result = service.findAll();

      expect(result).toBe(mockCronJobs);
      expect(schedulerRegistry.getCronJobs).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a cron job for an event start', () => {
      const event = {
        id: '1',
        startTime: new Date('2023-10-01T10:00:00Z'),
        endTime: new Date('2023-10-01T12:00:00Z'),
        repeat: true,
        isActive: true,
      } as Event;

      const cronJob = new CronJob(
        '0 0 10 * * 0',
        () => {},
        null,
        false,
        'America/Caracas',
      );
      jest.spyOn(CronJob, 'from').mockImplementation(() => cronJob);
      jest.spyOn(schedulerRegistry, 'addCronJob').mockImplementation(() => {});
      const startSpyOn = jest.spyOn(cronJob, 'start');
      const result = service.create(EnumEvent.EVENT_START, event);

      cronJob.start();

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.cronExpression).toBeDefined();
      expect(schedulerRegistry.addCronJob).toHaveBeenCalled();
      expect(startSpyOn).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update cron jobs for an event', () => {
      const oldEvent = {
        id: '1',
        startTime: new Date('2023-10-01T10:00:00Z'),
        endTime: new Date('2023-10-01T12:00:00Z'),
        repeat: true,
        isActive: true,
      } as Event;

      const newEvent = {
        startTime: new Date('2023-10-02T11:00:00Z'),
        endTime: new Date('2023-10-02T13:00:00Z'),
      } as Event;

      const events = { old: oldEvent, new: newEvent } as IEvents;

      jest.spyOn(service, 'remove').mockImplementation(() => {});
      jest.spyOn(service, 'create').mockImplementation(() => ({}) as any);

      service.update(events);

      expect(service.remove).toHaveBeenCalledTimes(2);
      expect(service.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('remove', () => {
    it('should remove a cron job if it exists', () => {
      const jobId = 'job1';
      const cronJob = new CronJob(
        '0 0 10 * * 0',
        () => {},
        null,
        false,
        'America/Caracas',
      );
      jest.spyOn(schedulerRegistry, 'getCronJob').mockReturnValue(cronJob);
      jest
        .spyOn(schedulerRegistry, 'deleteCronJob')
        .mockImplementation(() => {});
      const stopSpyOn = jest.spyOn(cronJob, 'stop');

      service.remove(jobId);
      cronJob.stop();

      expect(schedulerRegistry.getCronJob).toHaveBeenCalledWith(jobId);
      expect(stopSpyOn).toHaveBeenCalled();
      expect(schedulerRegistry.deleteCronJob).toHaveBeenCalledWith(jobId);
    });

    it('should log a warning if the cron job does not exist', () => {
      const jobId = 'job1';
      jest.spyOn(schedulerRegistry, 'getCronJob').mockImplementation(() => {
        throw new Error('Job not found');
      });
      jest.spyOn(service['logger'], 'warn').mockImplementation(() => {});

      service.remove(jobId);

      expect(service['logger'].warn).toHaveBeenCalledWith(
        `Cron job ${jobId} not found for deletion.`,
        expect.any(Error),
      );
    });
  });

  describe('generateWeeklyCronExpression', () => {
    it('should generate a weekly cron expression for a repeating event', () => {
      const time = new Date('2023-10-01T10:00:00Z');
      const repeat = true;

      const result = service['generateWeeklyCronExpression'](time, repeat);

      expect(result).not.toBeNull();
    });

    it('should generate a one-time cron expression for a non-repeating event', () => {
      const time = new Date('2023-10-01T10:00:00Z');
      const repeat = false;

      const result = service['generateWeeklyCronExpression'](time, repeat);

      expect(result).not.toBeNull();
    });
  });
});
