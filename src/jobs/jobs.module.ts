import { Module } from '@nestjs/common';
import { JobsService } from '@jobs/jobs.service';
import { JobsController } from '@jobs/jobs.controller';
import { ScheduleService } from '@jobs/schedule.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, ScheduleService],
  exports: [JobsService, ScheduleService],
})
export class JobsModule {}
