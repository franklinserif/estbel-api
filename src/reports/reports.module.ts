import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterService } from './printer.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, PrinterService],
})
export class ReportsModule {}
