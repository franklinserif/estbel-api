import { Module } from '@nestjs/common';
import { AttendancesService } from '@attendances/attendances.service';
import { AttendancesController } from '@attendances/attendances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '@attendances/entities/attendance.entity';
import { MembersModule } from '@members/members.module';
import { EventsModule } from '@events/events.module';

@Module({
  controllers: [AttendancesController],
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    MembersModule,
    EventsModule,
  ],
  providers: [AttendancesService],
  exports: [AttendancesService, TypeOrmModule],
})
export class AttendancesModule {}
