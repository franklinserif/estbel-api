import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  scheduleEventNotification(eventId: string, startTime: Date) {
    const cronExpression = this.generateWeeklyCronExpression(startTime);
    const job = new CronJob(cronExpression, () => {
      this.logger.log(`The repeating event ${eventId} has started.`);
      this.notifyUsers(eventId);
    });

    this.schedulerRegistry.addCronJob(`event-${eventId}-weekly`, job);
    job.start();
  }

  private generateWeeklyCronExpression(startTime: Date) {
    const dayOfWeek = startTime.getUTCDay();
    const hour = startTime.getUTCHours();
    const minute = startTime.getUTCMinutes();

    return `${minute} ${hour} * * ${dayOfWeek}`;
  }

  cancelRepeatingEvent(eventId: number): void {
    this.schedulerRegistry.deleteCronJob(`event-${eventId}-weekly`);
    this.logger.log(`Repeating event ${eventId} has been canceled.`);
  }

  private notifyUsers(eventId: string) {
    this.logger.log('notify users..');
  }
}
