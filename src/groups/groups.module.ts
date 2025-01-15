import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupType } from '@groupTypes/entities/group-types.entity';

@Module({
  controllers: [GroupsController],
  imports: [TypeOrmModule.forFeature([Group, GroupType])],
  providers: [GroupsService],
  exports: [TypeOrmModule],
})
export class GroupsModule {}
