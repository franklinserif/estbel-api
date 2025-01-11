import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupTypesDto } from './create-group-types.dto';

export class UpdateGroupTypesDto extends PartialType(CreateGroupTypesDto) {}
