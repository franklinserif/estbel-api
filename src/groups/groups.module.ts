import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupTypesModule } from '@groupTypes/group-types.module';
import { MembersModule } from '@members/members.module';

@Module({
  controllers: [GroupsController],
  imports: [TypeOrmModule.forFeature([Group]), GroupTypesModule, MembersModule],
  providers: [GroupsService],
  exports: [TypeOrmModule, GroupsService],
})
export class GroupsModule {}
