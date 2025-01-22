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

  /**
   * Retrieves all scheduled cron jobs.
   *
   * @returns {Array<{ name: string, nextInvocation: string }>} A list of cron jobs with their names and next invocation times.
   */
  findAll(): Array<{ name: string; nextInvocation: string }> {
    const cronJobs = this.schedulerRegistry.getCronJobs();

    return Array.from(cronJobs.entries()).map(([name, job]) => ({
      name,
      nextInvocation: job.nextDate().toString(),
    }));
  }

  /**
   * Adds cron jobs for a list of events.
   *
   * @param {Event[]} events - The events to schedule.
   */
  addCronJobs(events: Event[]): void {
    for (const event of events) {
      this.scheduleEventNotification(event);
    }
  }

  /**
   * Schedules event notifications for a given event.
   *
   * @param {Event} event - The event to schedule.
   * @returns {JobInfo} Information about the scheduled cron jobs.
   */
  scheduleEventNotification(event: Event): JobInfo {
    const startCronExpression = this.generateWeeklyCronExpression(
      event.startTime,
      event.repeat,
    );

    const startJob = this.createCronJob(
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

    const endJob = this.createCronJob(
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

  /**
   * Generates a cron expression based on the event's start or end time and repeat configuration.
   *
   * @param {Date} time - The time to generate the cron expression for.
   * @param {boolean} repeat - Whether the event repeats weekly.
   * @returns {string} The generated cron expression.
   */
  private generateWeeklyCronExpression(time: Date, repeat: boolean): string {
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

  /**
   * Updates the cron job for an event when its details change.
   *
   * @param {Event} oldEvent - The event before the update.
   * @param {Event} newEvent - The event after the update.
   */
  updateCronJob(oldEvent: Event, newEvent: Event): void {
    const startJobKey = `event-${oldEvent.id}-start-${oldEvent.repeat ? 'weekly' : 'day'}`;
    const endJobKey = `event-${oldEvent.id}-end-${oldEvent.repeat ? 'weekly' : 'day'}`;

    this.deleteCronJobIfExists(startJobKey);
    this.deleteCronJobIfExists(endJobKey);

    this.scheduleEventNotification({
      ...oldEvent,
      ...newEvent,
      startTime: new Date(newEvent.startTime),
      endTime: new Date(newEvent.endTime),
    } as Event);
  }

  /**
   * Cancels the cron job for a given event.
   *
   * @param {Event} event - The event to cancel.
   */
  cancelEvent(event: Event): void {
    const jobKey = `event-${event.id}-${event.repeat ? 'weekly' : 'day'}`;
    this.deleteCronJobIfExists(jobKey);
    this.logger.log(`Repeating event ${event.id} has been canceled.`);
  }

  /**
   * Notifies users about an event (placeholder implementation).
   *
   * @param {string} eventId - The ID of the event to notify users about.
   */
  private notifyUsers(eventId: string): void {
    this.logger.log('Notifying users...', eventId);
  }

  /**
   * Creates a cron job for an event.
   *
   * @param {string} cronExpression - The cron expression for the job.
   * @param {string} message - The log message to display when the job runs.
   * @param {string} eventId - The ID of the event.
   * @param {boolean} isActive - Whether the event is active.
   * @returns {CronJob} The created cron job.
   */
  private createCronJob(
    cronExpression: string,
    message: string,
    eventId: string,
    isActive: boolean,
  ): CronJob {
    return new CronJob(
      cronExpression,
      async () => {
        this.logger.log(message);
        this.notifyUsers(eventId);
        await this.eventRepository.update(eventId, { isActive });
      },
      null,
      false,
      TIME_ZONE_CARACAS,
    );
  }

  /**
   * Deletes a cron job if it exists.
   *
   * @param {string} jobKey - The key of the cron job to delete.
   */
  private deleteCronJobIfExists(jobKey: string): void {
    try {
      const existingJob = this.schedulerRegistry.getCronJob(jobKey);
      if (existingJob) {
        existingJob.stop();
        this.schedulerRegistry.deleteCronJob(jobKey);
        this.logger.log(`Cron job ${jobKey} removed.`);
      }
    } catch (error) {
      this.logger.warn(`Cron job ${jobKey} not found for deletion.`, error);
    }
  }
}
