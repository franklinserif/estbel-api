import { Injectable, Logger } from '@nestjs/common';
import { Event } from './entities/event.entity';
import { JobInfo } from '@common/interfaces/schedule';
import { OnEvent } from '@nestjs/event-emitter';
import { EnumEvent } from './enum/event';
import { JobsService } from './jobs.service';
import { EventUtils } from '@common/libs/event';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly jobsService: JobsService) {}

  /**
   * Retrieves all scheduled cron jobs.
   * @returns {Array<{ name: string, nextInvocation: string }>} A list of cron jobs with their names and next invocation times.
   */
  findAll(): Array<{ name: string; nextInvocation: string }> {
    const cronJobs = this.jobsService.findAll();

    return Array.from(cronJobs.entries()).map(([name, job]) => ({
      name,
      nextInvocation: job.nextDate().toString(),
    }));
  }

  /**
   * Adds cron jobs for a list of events.
   * @param {Event[]} events - The events to schedule.
   */
  addCronJobs(events: Event[]): void {
    for (const event of events) {
      this.scheduleEvent(event);
    }
  }

  /**
   * Schedules event notifications for a given event.
   * @param {Event} event - The event to schedule.
   * @returns {JobInfo} Information about the scheduled cron jobs.
   */
  @OnEvent(EnumEvent.EVENT_CREATED)
  scheduleEvent(event: Event): JobInfo {
    const startJob = this.jobsService.create(EnumEvent.EVENT_START, event);

    const endJob = this.jobsService.create(EnumEvent.EVENT_END, event);

    const jobInfo = {
      start: { cronExpression: startJob.cronExpression, jobKey: startJob.id },
      end: { cronExpression: endJob.cronExpression, jobKey: endJob.id },
    };

    return jobInfo;
  }

  /**
   * Cancels the cron job for a given event.
   * @param {Event} event - The event to cancel.
   */
  cancelEvent(event: Event): void {
    const jobStartId = EventUtils.getEventId(event, EnumEvent.EVENT_START);
    const jobEndId = EventUtils.getEventId(event, EnumEvent.EVENT_END);

    this.jobsService.remove(jobStartId);
    this.jobsService.remove(jobEndId);

    this.logger.log(`Repeating event ${event.id} has been canceled.`);
  }
}
