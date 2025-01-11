import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberStatusDto } from './create-member-status.dto';

export class UpdateMemberStatusDto extends PartialType(CreateMemberStatusDto) {}
