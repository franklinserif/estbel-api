import { Module } from '@nestjs/common';
import { AdminsModule } from '@admins/admins.module';
import { MembersModule } from '@members/members.module';
import { GroupsModule } from '@groups/groups.module';
import { ConfigurationModule } from '@configuration/configuration.module';
import { PrinterService } from '@reports/printer.service';
import { ReportsController } from '@reports/reports.controller';
import { ReportsService } from '@reports/reports.service';

@Module({
  controllers: [ReportsController],
  imports: [AdminsModule, MembersModule, GroupsModule, ConfigurationModule],
  providers: [ReportsService, PrinterService],
})
export class ReportsModule {}
