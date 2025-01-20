import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('test')
  async test(@Res() response: Response) {
    const pdfDoc = await this.reportsService.test();

    response.setHeader('Content-type', 'application/pdf');
    pdfDoc.info.Title = 'test';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('admins')
  async adminsReport(
    @QueryParams() queryParams: IQueryParams,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.adminsReport(queryParams);

    response.setHeader('Content-type', 'application/pdf');
    pdfDoc.info.Title = 'reporte de administradores';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('members')
  async membersReport(
    @QueryParams() queryParams: IQueryParams,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.membersReport(queryParams);

    response.setHeader('Content-type', 'application/pdf');
    pdfDoc.info.Title = 'reporte de miembros';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('groups')
  async groupsReport(
    @QueryParams() queryParams: IQueryParams,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.groupsReport(queryParams);

    response.setHeader('Content-type', 'application/pdf');
    pdfDoc.info.Title = 'reporte de grupos';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
