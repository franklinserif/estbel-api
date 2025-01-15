import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { GroupType } from '@groupTypes/entities/group-types.entity';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  groupTypes?: GroupType;
}
