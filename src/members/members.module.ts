import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { MemberStatus } from '@memberStatus/entities/member-status.entity';

@Module({
  controllers: [MembersController],
  imports: [TypeOrmModule.forFeature([Member, MemberStatus])],
  providers: [MembersService],
  exports: [TypeOrmModule, MembersService],
})
export class MembersModule {}
