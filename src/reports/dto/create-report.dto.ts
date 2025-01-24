import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsOptional()
  @IsArray()
  @IsString()
  rows: string[];
}
