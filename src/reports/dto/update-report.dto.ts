import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from '@reports/dto/create-report.dto';

export class UpdateReportDto extends PartialType(CreateReportDto) {}
