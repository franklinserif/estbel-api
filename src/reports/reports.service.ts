import { Injectable } from '@nestjs/common';
import { IQueryParams } from '@common/interfaces/decorators';
import { PrinterService } from './printer.service';
import { testReport } from './documents/test.report';
import { UsersService } from '@users/users.service';
import { userReport } from './documents/users.report';
import { MembersService } from '@members/members.service';
import { membersReport } from './documents/members.report';
import { FieldsService } from '@fields/fields.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly usersService: UsersService,
    private readonly membersService: MembersService,
    private readonly fieldsService: FieldsService,
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

    const fields = await this.fieldsService.findAll({ where: {}, order: {} });

    console.log('members: ', members[0]);
    console.log(
      'fields: ',
      fields.map((field) => field.fieldName),
    );

    return this.printerService.createPDF(membersReport(members, fields));
  }
}
