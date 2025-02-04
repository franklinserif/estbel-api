import { Module } from '@nestjs/common';
import { AdminsModule } from '@admins/admins.module';
import { MembersModule } from '@members/members.module';
import { PrinterService } from '@reports/printer.service';
import { ReportsController } from '@reports/reports.controller';
import { ReportsService } from '@reports/reports.service';
import { GroupsModule } from '@groups/groups.module';

@Module({
  controllers: [ReportsController],
  imports: [AdminsModule, MembersModule, GroupsModule],
  providers: [ReportsService, PrinterService],
})
export class ReportsModule {}
