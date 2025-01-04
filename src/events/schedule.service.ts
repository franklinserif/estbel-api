import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Event } from './entities/event.entity';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  findAll() {
    const cronJobs = this.schedulerRegistry.getCronJobs();

    console.log('con-jobs:  ', cronJobs);

    return cronJobs;
  }

  scheduleEventNotification(event: Event) {
    const cronExpression = this.generateWeeklyCronExpression(
      event.startTime,
      event.repeat,
    );
    const job = new CronJob(cronExpression, () => {
      this.logger.log(`The repeating event ${event.id} has started.`);
      this.notifyUsers(event.id);
    });

    this.schedulerRegistry.addCronJob(
      `event-${event.id}-${event.repeat ? 'weekly' : 'day'}`,
      job,
    );

    job.start();
  }

  private generateWeeklyCronExpression(startTime: Date, repeat: boolean) {
    const minutes = startTime.getUTCMinutes();
    const hours = startTime.getUTCHours();
    const dayOfMonth = startTime.getUTCDate();
    const month = startTime.getUTCMonth() + 1;
    const dayOfWeek = startTime.getUTCDay();

    if (repeat) {
      return `${minutes} ${hours} * * ${dayOfWeek}`;
    } else {
      return `${minutes} ${hours} ${dayOfMonth} ${month} *`;
    }
  }

  updateCronJob(oldEvent: Event, newEvent: Event) {
    const jobKey = `event-${oldEvent.id}-${oldEvent.repeat ? 'weekly' : 'day'}`;

    const existingJob = this.schedulerRegistry.getCronJob(jobKey);

    if (existingJob) {
      existingJob.stop();
      this.schedulerRegistry.deleteCronJob(jobKey);
      this.logger.log(`Cron job for event ${newEvent.id} removed.`);
    }

    const newCronExpression = this.generateWeeklyCronExpression(
      newEvent.startTime,
      newEvent.repeat,
    );
    const newJob = new CronJob(newCronExpression, () => {
      this.logger.log(
        `The updated repeating event ${newEvent.id} has started.`,
      );
      this.notifyUsers(newEvent.id);
    });

    this.schedulerRegistry.addCronJob(jobKey, newJob);
    newJob.start();
    this.logger.log(`Cron job for event ${newEvent.id} updated with new time.`);
  }

  cancelEvent(event: Event): void {
    this.schedulerRegistry.deleteCronJob(
      `event-${event.id}-${event.repeat ? 'weekly' : 'day'}`,
    );
    this.logger.log(`Repeating event ${event.id} has been canceled.`);
  }

  private notifyUsers(eventId: string) {
    this.logger.log('notify users..');
  }
}
