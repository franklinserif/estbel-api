import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from '@members/members.module';
import { EventsService } from '@events/events.service';
import { EventsController } from '@events/events.controller';
import { Event } from '@events/entities/event.entity';
import { Attendance } from '@attendances/entities/attendance.entity';
import { ScheduleService } from '@events/schedule.service';
import { AttendancesService } from '@attendances/attendances.service';
import { JobsService } from '@events/jobs.service';
import { AdminsModule } from '@admins/admins.module';
import { ConfigurationModule } from '@configuration/configuration.module';

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
