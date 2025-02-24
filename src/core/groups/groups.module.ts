import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from '@groups/groups.service';
import { MembersModule } from '@members/members.module';
import { GroupsController } from '@groups/groups.controller';
import { Group } from '@groups/entities/group.entity';
import { GroupTypesModule } from '@groupTypes/group-types.module';

@Module({
  controllers: [GroupsController],
  imports: [TypeOrmModule.forFeature([Group]), GroupTypesModule, MembersModule],
  providers: [GroupsService],
  exports: [TypeOrmModule, GroupsService],
})
export class GroupsModule {}
