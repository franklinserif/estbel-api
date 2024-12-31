import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Attendance } from './entities/attendance.entity';
import { MembersModule } from '@members/members.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [EventsController],
  imports: [
    TypeOrmModule.forFeature([Event, Attendance]),
    ScheduleModule.forRoot(),
    MembersModule,
  ],
  providers: [EventsService],
  exports: [TypeOrmModule],
})
export class EventsModule {}
