import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Event } from './entities/event.entity';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  scheduleEventNotification(event: Event) {
    const cronExpression = this.generateWeeklyCronExpression(
      event.startTime,
      event.repeat,
    );
    const job = new CronJob(cronExpression, () => {
      this.logger.log(`The repeating event ${event.id} has started.`);
      this.notifyUsers(event.id);
    });

    this.schedulerRegistry.addCronJob(`event-${event.id}-weekly`, job);
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

  cancelRepeatingEvent(eventId: number): void {
    this.schedulerRegistry.deleteCronJob(`event-${eventId}-weekly`);
    this.logger.log(`Repeating event ${eventId} has been canceled.`);
  }

  private notifyUsers(eventId: string) {
    this.logger.log('notify users..');
  }
}
