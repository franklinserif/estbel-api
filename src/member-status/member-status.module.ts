import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberStatusController } from '@memberStatus/member-status.controller';
import { MemberStatusService } from '@memberStatus/member-status.service';
import { MemberStatus } from '@memberStatus/entities/member-status.entity';

@Module({
  controllers: [MemberStatusController],
  imports: [TypeOrmModule.forFeature([MemberStatus])],
  providers: [MemberStatusService],
  exports: [TypeOrmModule, MemberStatusService],
})
export class MemberStatusModule {}
