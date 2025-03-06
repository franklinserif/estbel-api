import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from '@members/members.module';
import { AdminsModule } from '@admins/admins.module';
import { Attendance } from '@attendances/entities/attendance.entity';
import { AttendancesService } from '@attendances/attendances.service';
import { ConfigurationModule } from '@configuration/configuration.module';
import { EventsService } from '@events/events.service';
import { EventsController } from '@events/events.controller';
import { Event } from '@events/entities/event.entity';
import { ScheduleService } from '@events/schedule.service';
import { JobsService } from '@events/jobs.service';

@Module({
  controllers: [EventsController],
  imports: [
    TypeOrmModule.forFeature([Event, Attendance]),
    MembersModule,
    forwardRef(() => AdminsModule),
    ConfigurationModule,
  ],
  providers: [EventsService, ScheduleService, AttendancesService, JobsService],
  exports: [TypeOrmModule, EventsService],
})
export class EventsModule {}
