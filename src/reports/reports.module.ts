import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterService } from './printer.service';
import { AdminsModule } from '@admins/admins.module';
import { MembersModule } from '@members/members.module';
import { GroupsModule } from '@groups/groups.module';

@Module({
  controllers: [ReportsController],
  imports: [AdminsModule, MembersModule, GroupsModule],
  providers: [ReportsService, PrinterService],
})
export class ReportsModule {}
