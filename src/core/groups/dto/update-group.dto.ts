import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { GroupType } from '@groupTypes/entities/group-types.entity';
import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';
import { IsUUIDOrCI } from '@members/decorators/is-uuidor-ci.decorator';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  groupTypes?: GroupType;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUIDOrCI({ each: true })
  membersIds?: string[];
}
