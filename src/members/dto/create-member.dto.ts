import { CreateFieldValueDto } from '@fields/dto/create-field-value.dto';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  ci: string;

  @ValidateNested({ each: true })
  @Type(() => CreateFieldValueDto)
  @IsArray()
  fields: CreateFieldValueDto[];
}
