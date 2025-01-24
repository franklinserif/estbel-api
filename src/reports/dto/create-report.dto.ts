import { IsArray, IsString } from 'class-validator';

export class CreateReportDto {
  @IsArray()
  @IsString()
  rows: string[];
}
