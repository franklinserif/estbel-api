import { forwardRef, Module } from '@nestjs/common';
import { MembersService } from '@members/members.service';
import { MembersController } from '@members/members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@members/entities/member.entity';
import { MemberStatusModule } from '@memberStatus/member-status.module';
import { ConfigurationModule } from '@configuration/configuration.module';
import { AdminsModule } from '@admins/admins.module';

@Module({
  controllers: [MembersController],
  imports: [
    forwardRef(() => AdminsModule),
    TypeOrmModule.forFeature([Member]),
    MemberStatusModule,
    ConfigurationModule,
  ],
  providers: [MembersService],
  exports: [TypeOrmModule, MembersService],
})
export class MembersModule {}
