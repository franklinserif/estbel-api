import { Injectable } from '@nestjs/common';
import { IQueryParams } from '@common/interfaces/decorators';
import { PrinterService } from './printer.service';
import { testReport } from './documents/test.report';
import { AdminsService } from '@admins/admins.service';
import { adminsDoc } from './documents/admins.report';
import { MembersService } from '@members/members.service';
import { membersDoc } from './documents/members.report';
import { GroupsService } from '@groups/groups.service';
import { groupsDoc } from './documents/groups.report';

@Injectable()
export class ReportsService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly adminsService: AdminsService,
    private readonly membersService: MembersService,
    private readonly groupsService: GroupsService,
  ) {}

  async test(): Promise<PDFKit.PDFDocument> {
    return this.printerService.createPDF(testReport());
  }

  async adminsReport(queryParams: IQueryParams) {
    const users = await this.adminsService.findAll(queryParams);

    return this.printerService.createPDF(adminsDoc(users));
  }

  async membersReport(queryParams: IQueryParams) {
    const members = await this.membersService.findAll(queryParams);

    return this.printerService.createPDF(membersDoc(members));
  }

  async groupsReport(queryParams: IQueryParams) {
    const groups = await this.groupsService.findAll(queryParams);

    return this.printerService.createPDF(groupsDoc(groups));
  }
}
