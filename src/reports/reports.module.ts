import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterService } from './printer.service';
import { UsersModule } from '@users/users.module';
import { MembersModule } from '@members/members.module';
import { FieldsModule } from '@fields/fields.module';

@Module({
  controllers: [ReportsController],
  imports: [UsersModule, MembersModule, FieldsModule],
  providers: [ReportsService, PrinterService],
})
export class ReportsModule {}
