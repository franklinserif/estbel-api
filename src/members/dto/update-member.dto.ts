import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';
import { MemberStatus } from '@memberStatus/entities/member-status.entity';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  membersStatus?: MemberStatus[];
}
