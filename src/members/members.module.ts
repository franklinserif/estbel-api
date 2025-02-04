import { Module } from '@nestjs/common';
import { MembersService } from '@members/members.service';
import { MembersController } from '@members/members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@members/entities/member.entity';
import { MemberStatusModule } from '@memberStatus/member-status.module';

@Module({
  controllers: [MembersController],
  imports: [TypeOrmModule.forFeature([Member]), MemberStatusModule],
  providers: [MembersService],
  exports: [TypeOrmModule, MembersService],
})
export class MembersModule {}
