import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Endpoint to generate a test PDF document.
   *
   * @param {Response} response - The HTTP response object.
   */
  @Get('test')
  async test(@Res() response: Response) {
    const pdfDoc = await this.reportsService.test();

    response.setHeader('Content-type', 'application/pdf');
    pdfDoc.info.Title = 'test';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  /**
   * Endpoint to generate a PDF report for admins based on query parameters.
   *
   * @param {IQueryParams} queryParams - The query parameters for fetching admins.
   * @param {Response} response - The HTTP response object.
   */
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

  /**
   * Endpoint to generate a PDF report for members based on query parameters.
   *
   * @param {IQueryParams} queryParams - The query parameters for fetching members.
   * @param {Response} response - The HTTP response object.
   */
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

  /**
   * Endpoint to generate a PDF report for groups based on query parameters.
   *
   * @param {IQueryParams} queryParams - The query parameters for fetching groups.
   * @param {Response} response - The HTTP response object.
   */
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
