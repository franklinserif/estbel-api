import { Injectable } from '@nestjs/common';
import { IQueryParams } from '@common/interfaces/decorators';
import { PrinterService } from './printer.service';
import { testReport } from './documents/test.report';
import { AdminsService } from '@admins/admins.service';
import { adminsReport } from './documents/admins.report';
import { MembersService } from '@members/members.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly adminsService: AdminsService,
    private readonly membersService: MembersService,
  ) {}

  async test(): Promise<PDFKit.PDFDocument> {
    return this.printerService.createPDF(testReport());
  }

  async adminsReport(queryParams: IQueryParams) {
    const users = await this.adminsService.findAll(queryParams);

    return this.printerService.createPDF(adminsReport(users));
  }

  async membersReport(queryParams: IQueryParams) {
    const members = await this.membersService.findAll(queryParams);

    return members;
  }
}
