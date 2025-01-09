import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterService } from './printer.service';
import { UsersModule } from '@users/users.module';
import { MembersModule } from '@members/members.module';

@Module({
  controllers: [ReportsController],
  imports: [UsersModule, MembersModule],
  providers: [ReportsService, PrinterService],
})
export class ReportsModule {}
