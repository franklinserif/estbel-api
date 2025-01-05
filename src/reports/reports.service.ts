import { Injectable } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { testReport } from './documents/test.report';

@Injectable()
export class ReportsService {
  constructor(private readonly printerService: PrinterService) {}

  async test(): Promise<PDFKit.PDFDocument> {
    return this.printerService.createPDF(testReport());
  }
}
