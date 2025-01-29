import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from '@members/members.module';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { Attendance } from './entities/attendance.entity';
import { ScheduleService } from './schedule.service';
import { AttendancesService } from './attendances.service';

@Module({
  controllers: [EventsController],
  imports: [TypeOrmModule.forFeature([Event, Attendance]), MembersModule],
  providers: [EventsService, ScheduleService, AttendancesService],
  exports: [TypeOrmModule],
})
export class EventsModule {}
