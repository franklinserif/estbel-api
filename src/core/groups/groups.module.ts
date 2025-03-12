import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from '@members/members.module';
import { ConfigurationModule } from '@configuration/configuration.module';
import { GroupsService } from '@groups/groups.service';
import { GroupTypesModule } from '@groupTypes/group-types.module';
import { Group } from '@groups/entities/group.entity';
import { GroupsController } from '@groups/groups.controller';
import { AuthModule } from '@auth/auth.module';
import { AdminsModule } from '@admins/admins.module';

@Module({
  controllers: [GroupsController],
  imports: [
    TypeOrmModule.forFeature([Group]),
    GroupTypesModule,
    MembersModule,
    forwardRef(() => AuthModule),
    forwardRef(() => AdminsModule),
    ConfigurationModule,
  ],
  providers: [GroupsService],
  exports: [TypeOrmModule, GroupsService],
})
export class GroupsModule {}
