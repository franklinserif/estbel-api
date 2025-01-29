import { CronJob } from 'cron';

export interface IJob {
  id: string;
  cronJob: CronJob<any, null>;
  cronExpression: string;
}
