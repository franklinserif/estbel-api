import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { QueryParams } from 'src/admins/decorators/query-params.decorator';
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
}
