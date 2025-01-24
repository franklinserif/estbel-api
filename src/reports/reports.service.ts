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
import { groupMembersDoc } from './documents/groupMembers.report';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly adminsService: AdminsService,
    private readonly membersService: MembersService,
    private readonly groupsService: GroupsService,
  ) {}

  /**
   * Generates a test PDF document.
   *
   * @returns {Promise<PDFKit.PDFDocument>} - The generated PDF document.
   */
  async test(): Promise<PDFKit.PDFDocument> {
    return this.printerService.createPDF(testReport());
  }

  /**
   * Generates a PDF report for admins based on the provided query parameters.
   *
   * @param {IQueryParams} queryParams - The query parameters for fetching admins.
   * @returns {Promise<PDFKit.PDFDocument>} - The generated PDF document.
   */
  async adminsReport(
    queryParams: IQueryParams,
    createReport: CreateReportDto,
  ): Promise<PDFKit.PDFDocument> {
    const admins = await this.adminsService.findAll(queryParams);

    const { rows } = createReport;

    return this.printerService.createPDF(adminsDoc(admins, rows));
  }

  /**
   * Generates a PDF report for members based on the provided query parameters.
   *
   * @param {IQueryParams} queryParams - The query parameters for fetching members.
   * @returns {Promise<PDFKit.PDFDocument>} - The generated PDF document.
   */
  async membersReport(
    queryParams: IQueryParams,
    createReport: CreateReportDto,
  ): Promise<PDFKit.PDFDocument> {
    const members = await this.membersService.findAll(queryParams);

    const { rows } = createReport;

    return this.printerService.createPDF(membersDoc(members, rows));
  }

  /**
   * Generates a PDF report for groups based on the provided query parameters.
   *
   * @param {IQueryParams} queryParams - The query parameters for fetching groups.
   * @returns {Promise<PDFKit.PDFDocument>} - The generated PDF document.
   */
  async groupsReport(
    queryParams: IQueryParams,
    createReport: CreateReportDto,
  ): Promise<PDFKit.PDFDocument> {
    const groups = await this.groupsService.findAll(queryParams);

    const { rows } = createReport;

    return this.printerService.createPDF(groupsDoc(groups, rows));
  }

  /**
   *  Generates a PDF report with the group members information
   *
   * @param {string} id - the id of the group
   * @returns {Promise<PDFKit.DocumentInfo>} - The generated PDF Document
   */
  async groupMembersReport(
    id: string,
    createReport: CreateReportDto,
  ): Promise<PDFKit.PDFDocument> {
    const group = await this.groupsService.findOne(id);

    const { rows } = createReport;

    return this.printerService.createPDF(groupMembersDoc(group, rows));
  }
}
