import { forwardRef, Module } from '@nestjs/common';
import { AdminsModule } from '@admins/admins.module';
import { MembersModule } from '@members/members.module';
import { GroupsModule } from '@groups/groups.module';
import { ConfigurationModule } from '@configuration/configuration.module';
import { PrinterService } from '@reports/printer.service';
import { ReportsController } from '@reports/reports.controller';
import { ReportsService } from '@reports/reports.service';
import { AuthModule } from '@auth/auth.module';

@Module({
  controllers: [ReportsController],
  imports: [
    MembersModule,
    GroupsModule,
    forwardRef(() => AuthModule),
    forwardRef(() => AdminsModule),
    ConfigurationModule,
  ],
  providers: [ReportsService, PrinterService],
})
export class ReportsModule {}
