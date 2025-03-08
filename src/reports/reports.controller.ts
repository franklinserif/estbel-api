import { Body, Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';
import { Admin } from '@admins/entities/admin.entity';
import { Member } from '@members/entities/member.entity';
import { Group } from '@groups/entities/group.entity';
import { Authorization } from '@common/guards/Authorization.guard';
import { AuthPermission } from '@common/decorators/auth-permission.decorator';
import { MODULES } from '@shared/enums/modules';
import { PERMISSIONS } from '@shared/enums/permissions';
import { ReportsService } from '@reports/reports.service';
import { CreateReportDto } from '@reports/dto/create-report.dto';

@Controller('reports')
@UseGuards(Authorization)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Endpoint to generate a test PDF document.
   * @param {Response} response - The HTTP response object.
   */
  @Post('test')
  @AuthPermission(MODULES.REPORTS, PERMISSIONS.PRINT)
  async test(@Res() response: Response) {
    const pdfDoc = await this.reportsService.test();

    response.setHeader('Content-type', 'application/pdf');
    pdfDoc.info.Title = 'test';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  /**
   * Endpoint to generate a PDF report for admins based on query parameters.
   * @param {IQueryParams} queryParams - The query parameters for fetching admins.
   * @param {Response} response - The HTTP response object.
   */
  @Post('admins')
  @AuthPermission(MODULES.REPORTS, PERMISSIONS.PRINT)
  async adminsReport(
    @QueryParams(Admin) queryParams: IQueryParams,
    @Body() createReport: CreateReportDto,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.adminsReport(
      queryParams,
      createReport,
    );

    response.setHeader('Content-type', 'application/pdf');
    pdfDoc.info.Title = 'reporte de administradores';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  /**
   * Endpoint to generate a PDF report for members based on query parameters.
   * @param {IQueryParams} queryParams - The query parameters for fetching members.
   * @param {Response} response - The HTTP response object.
   */
  @Post('members')
  @AuthPermission(MODULES.REPORTS, PERMISSIONS.PRINT)
  async membersReport(
    @QueryParams(Member) queryParams: IQueryParams,
    @Body() createReport: CreateReportDto,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.membersReport(
      queryParams,
      createReport,
    );

    response.setHeader('Content-type', 'application/pdf');
    pdfDoc.info.Title = 'reporte de miembros';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  /**
   * Endpoint to generate a PDF report for groups based on query parameters.
   * @param {IQueryParams} queryParams - The query parameters for fetching groups.
   * @param {Response} response - The HTTP response object.
   */
  @Post('groups')
  @AuthPermission(MODULES.REPORTS, PERMISSIONS.PRINT)
  async groupsReport(
    @QueryParams(Group) queryParams: IQueryParams,
    @Body() createReport: CreateReportDto,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.groupsReport(
      queryParams,
      createReport,
    );

    response.setHeader('Content-type', 'application/pdf');
    pdfDoc.info.Title = 'reporte de grupos';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  /**
   * Endpoint to generate a PDF report for members of  the group.
   * @param {string} id - The id of the group.
   * @param {Response} response - The HTTP response object.
   */
  @Post('groups/:id/members')
  @AuthPermission(MODULES.REPORTS, PERMISSIONS.PRINT)
  async groupsMembersReport(
    @Param('id') id: string,
    @Body() createReport: CreateReportDto,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.groupMembersReport(
      id,
      createReport,
    );

    response.setHeader('Content-type', 'application/pdf');
    pdfDoc.info.Title = 'reporte de miembros de grupo';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
