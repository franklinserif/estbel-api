import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldValueDto } from './create-field-value.dto';

export class UpdateFielValuedDto extends PartialType(CreateFieldValueDto) {}
