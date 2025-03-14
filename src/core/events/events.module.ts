import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from '@members/members.module';
import { Attendance } from '@attendances/entities/attendance.entity';
import { AttendancesService } from '@attendances/attendances.service';
import { ConfigurationModule } from '@configuration/configuration.module';
import { EventsService } from '@events/events.service';
import { EventsController } from '@events/events.controller';
import { Event } from '@events/entities/event.entity';
import { JobsModule } from '@jobs/jobs.module';
import { AuthModule } from '@auth/auth.module';
import { AdminsModule } from '@admins/admins.module';

@Module({
  controllers: [EventsController],
  imports: [
    TypeOrmModule.forFeature([Event, Attendance]),
    MembersModule,
    forwardRef(() => AuthModule),
    forwardRef(() => AdminsModule),
    ConfigurationModule,
    JobsModule,
  ],
  providers: [EventsService, AttendancesService],
  exports: [TypeOrmModule, EventsService],
})
export class EventsModule {}
