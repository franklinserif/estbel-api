import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Event } from './entities/event.entity';
import { JobInfo } from '@common/interfaces/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TIME_ZONE_CARACAS } from '@common/constants/timeZone';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  findAll() {
    const cronJobs = this.schedulerRegistry.getCronJobs();

    const jobs = Array.from(cronJobs.entries()).map(([name, job]) => ({
      name,
      nextInvocation: job.nextDate().toString(),
    }));

    return jobs;
  }

  addCronJobs(events: Event[]) {
    for (const event of events) {
      const startCronJob = new CronJob(event.startCronExpression, async () => {
        this.logger.log(`The repeating event ${event.id} has started.`);
        this.notifyUsers(event.id);
      });

      this.schedulerRegistry.addCronJob(
        `event-${event.id}-start-${event.repeat ? 'weekly' : 'day'}`,
        startCronJob,
      );

      startCronJob.start();

      const endCronJob = new CronJob(event.endCronExpression, async () => {
        this.logger.log(`The repeating event ${event.id} has started.`);
        this.notifyUsers(event.id);
      });

      this.schedulerRegistry.addCronJob(
        `event-${event.id}-end-${event.repeat ? 'weekly' : 'day'}`,
        endCronJob,
      );

      endCronJob.start();
    }
  }

  scheduleEventNotification(event: Event): JobInfo {
    const startCronExpression = this.generateWeeklyCronExpression(
      event.startTime,
      event.repeat,
    );

    const startJob = this.job(
      startCronExpression,
      `The repeating event ${event.id} has started.`,
      event.id,
      true,
    );

    const startJobKey = `event-${event.id}-start-${event.repeat ? 'weekly' : 'day'}`;

    this.schedulerRegistry.addCronJob(startJobKey, startJob);

    startJob.start();
    const endCronExpression = this.generateWeeklyCronExpression(
      event.endTime,
      event.repeat,
    );

    const endJob = this.job(
      endCronExpression,
      `The repeating event ${event.id} has ended.`,
      event.id,
      false,
    );

    const endJobKey = `event-${event.id}-end-${event.repeat ? 'weekly' : 'day'}`;

    this.schedulerRegistry.addCronJob(endJobKey, endJob);

    endJob.start();

    return {
      start: { cronExpression: startCronExpression, jobKey: startJobKey },
      end: { cronExpression: endCronExpression, jobKey: endJobKey },
    };
  }

  private generateWeeklyCronExpression(startTime: Date, repeat: boolean) {
    const seconds = startTime.getSeconds();
    const minutes = startTime.getMinutes();
    const hours = startTime.getHours();
    const dayOfWeek = startTime.getDay();

    if (repeat) {
      return `${seconds} ${minutes} ${hours} * * ${dayOfWeek}`;
    } else {
      return `${seconds} ${minutes} ${hours} ${startTime.getDate()} ${startTime.getMonth() + 1} *`;
    }
  }

  updateCronJob(oldEvent: Event, newEvent: Event) {
    const startJobKey = `event-${oldEvent.id}-start-${oldEvent.repeat ? 'weekly' : 'day'}`;

    const existingStartJob = this.schedulerRegistry.getCronJob(startJobKey);

    if (existingStartJob) {
      existingStartJob.stop();
      this.schedulerRegistry.deleteCronJob(startJobKey);
      this.logger.log(`Cron job for event ${newEvent.id} removed.`);
    }

    const endJobKey = `event-${oldEvent.id}-end-${oldEvent.repeat ? 'weekly' : 'day'}`;

    const existingEndJob = this.schedulerRegistry.getCronJob(endJobKey);

    if (existingEndJob) {
      existingEndJob.stop();
      this.schedulerRegistry.deleteCronJob(endJobKey);
      this.logger.log(`Cron job for event ${newEvent.id} removed.`);
    }

    this.scheduleEventNotification({
      ...oldEvent,
      ...newEvent,
      startTime: new Date(newEvent.startTime),
      endTime: new Date(newEvent.endTime),
    } as Event);
  }

  cancelEvent(event: Event): void {
    this.schedulerRegistry.deleteCronJob(
      `event-${event.id}-${event.repeat ? 'weekly' : 'day'}`,
    );
    this.logger.log(`Repeating event ${event.id} has been canceled.`);
  }

  private notifyUsers(eventId: string) {
    this.logger.log('notify users..');

    console.log('eventId', eventId);
  }

  private job(
    cronExpression: string,
    message: string,
    eventId: string,
    isActive: boolean,
  ): CronJob<any, null> {
    const endJob = new CronJob(
      cronExpression,
      async () => {
        this.logger.log(message);
        this.notifyUsers(eventId);
        await this.eventRepository.update(eventId, {
          isActive,
        });
      },
      null,
      false,
      TIME_ZONE_CARACAS,
    );

    return endJob;
  }
}
