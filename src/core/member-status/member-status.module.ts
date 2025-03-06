import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsModule } from '@admins/admins.module';
import { ConfigurationModule } from '@configuration/configuration.module';
import { MemberStatusController } from '@memberStatus/member-status.controller';
import { MemberStatusService } from '@memberStatus/member-status.service';
import { MemberStatus } from '@memberStatus/entities/member-status.entity';

@Module({
  controllers: [MemberStatusController],
  imports: [
    TypeOrmModule.forFeature([MemberStatus]),
    forwardRef(() => AdminsModule),
    ConfigurationModule,
  ],
  providers: [MemberStatusService],
  exports: [TypeOrmModule, MemberStatusService],
})
export class MemberStatusModule {}
