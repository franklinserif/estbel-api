import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from '@members/dto/create-member.dto';
import { MemberStatus } from '@memberStatus/entities/member-status.entity';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  memberStatus?: MemberStatus;
}
