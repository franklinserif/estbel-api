import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '@configuration/configuration.module';
import { MemberStatusController } from '@memberStatus/member-status.controller';
import { MemberStatusService } from '@memberStatus/member-status.service';
import { MemberStatus } from '@memberStatus/entities/member-status.entity';
import { AuthModule } from '@auth/auth.module';
import { AdminsModule } from '@admins/admins.module';

@Module({
  controllers: [MemberStatusController],
  imports: [
    TypeOrmModule.forFeature([MemberStatus]),
    ConfigurationModule,
    forwardRef(() => AuthModule),
    forwardRef(() => AdminsModule),
  ],
  providers: [MemberStatusService],
  exports: [TypeOrmModule, MemberStatusService],
})
export class MemberStatusModule {}
