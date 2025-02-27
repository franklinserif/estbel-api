import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupTypesService } from '@groupTypes/group-types.service';
import { GroupTypesController } from '@groupTypes/group-types.controller';
import { GroupType } from '@groupTypes/entities/group-types.entity';

@Module({
  controllers: [GroupTypesController],
  imports: [TypeOrmModule.forFeature([GroupType])],
  providers: [GroupTypesService],
  exports: [TypeOrmModule, GroupTypesService],
})
export class GroupTypesModule {}
