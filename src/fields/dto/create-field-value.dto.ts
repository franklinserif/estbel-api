import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFieldDto } from './create-field.dto';

export class CreateFieldValueDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  fieldValue: string;

  @ValidateNested()
  @Type(() => CreateFieldDto)
  field: CreateFieldDto;
}
