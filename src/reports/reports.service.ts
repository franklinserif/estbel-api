import { Injectable } from '@nestjs/common';
import { IQueryParams } from '@common/interfaces/decorators';
import { PrinterService } from './printer.service';
import { testReport } from './documents/test.report';
import { UsersService } from '@users/users.service';
import { userReport } from './documents/users.report';
import { MembersService } from '@members/members.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly usersService: UsersService,
    private readonly membersService: MembersService,
  ) {}

  async test(): Promise<PDFKit.PDFDocument> {
    return this.printerService.createPDF(testReport());
  }

  async usersReport(queryParams: IQueryParams) {
    const users = await this.usersService.findAll(queryParams);

    return this.printerService.createPDF(userReport(users));
  }

  async membersReport(queryParams: IQueryParams) {
    const members = await this.membersService.findAll(queryParams);

    return members;
  }
}
