import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EEvent } from './enum/eventName';
import { TIME_ZONE_CARACAS } from '@common/constants/timeZone';
import { Event } from './entities/event.entity';
import { IJob } from './interfaces/job';
import { TEventState, IEvents } from './interfaces/event';
import { EventUtils } from '@common/libs/event';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * it retrieve a list of cron jobs
   *
   * @returns {Map<string, CronJob<null, null>>} a list of cronjobs
   */
  findAll(): Map<string, CronJob<null, null>> {
    const cronJobs = this.schedulerRegistry.getCronJobs();

    return cronJobs;
  }

  /**
   * Creates a cron job for an event.
   *
   * @param {'start' | 'end'} eventState - if the event is starter or ending.
   * @returns {Event} the event information.
   */
  create(eventState: TEventState, event: Event): IJob {
    const cronExpression = this.generateWeeklyCronExpression(
      new Date(
        eventState === EEvent.EVENT_START ? event.startTime : event.endTime,
      ),
      event.repeat,
    );

    const cronJob = new CronJob(
      cronExpression,
      async () => {
        this.logger.log(`The repeating event ${event.id} has ${eventState}.`);
        this.eventEmitter.emit(EEvent.EVENT_START, {
          eventId: event.id,
          isActive: event.isActive,
        });
      },
      null,
      false,
      TIME_ZONE_CARACAS,
    );
    const jobId = EventUtils.getEventId(event, eventState);
    this.schedulerRegistry.addCronJob(jobId, cronJob);
    cronJob.start();

    return { ...cronJob, id: jobId, cronExpression } as unknown as IJob;
  }

  /**
   * Updates the cron job for an event when its details change.
   *
   * @param {IEvents} events
   */
  @OnEvent(EEvent.EVENT_UPDATED)
  update(events: IEvents): void {
    const startJobKey = EventUtils.getEventId(events.old, EEvent.EVENT_START);
    const endJobKey = EventUtils.getEventId(events.old, EEvent.EVENT_END);

    this.remove(startJobKey);
    this.remove(endJobKey);

    this.create(EEvent.EVENT_START, {
      ...events.old,
      ...events.new,
      startTime: new Date(events.new.startTime),
      endTime: new Date(events.new.endTime),
    } as Event);

    this.create(EEvent.EVENT_END, {
      ...events.old,
      ...events.new,
      startTime: new Date(events.new.startTime),
      endTime: new Date(events.new.endTime),
    } as Event);
  }

  /**
   * Deletes a cron job if it exists.
   *
   * @param {string} id - The key of the cron job to delete.
   */
  remove(id: string): void {
    try {
      const existingJob = this.schedulerRegistry.getCronJob(id);
      if (existingJob) {
        existingJob.stop();
        this.schedulerRegistry.deleteCronJob(id);
        this.logger.log(`Cron job ${id} removed.`);
      }
    } catch (error) {
      this.logger.warn(`Cron job ${id} not found for deletion.`, error);
    }
  }

  /**
   * Generates a cron expression based on the event's start or end time and repeat configuration.
   *
   * @param {Date} time - The time to generate the cron expression for.
   * @param {boolean} repeat - Whether the event repeats weekly.
   * @returns {string} The generated cron expression.
   */
  private generateWeeklyCronExpression(time: Date, repeat: boolean): string {
    if (typeof time === 'string') {
      time = new Date(time);
    }

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();
    const dayOfWeek = time.getDay();

    if (repeat) {
      return `${seconds} ${minutes} ${hours} * * ${dayOfWeek}`;
    } else {
      return `${seconds} ${minutes} ${hours} ${time.getDate()} ${time.getMonth() + 1} *`;
    }
  }
}
