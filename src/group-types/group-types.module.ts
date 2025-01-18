import { Module } from '@nestjs/common';
import { GroupTypesService } from './group-types.service';
import { GroupTypesController } from './group-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupType } from './entities/group-types.entity';

@Module({
  controllers: [GroupTypesController],
  imports: [TypeOrmModule.forFeature([GroupType])],
  providers: [GroupTypesService],
  exports: [TypeOrmModule],
})
export class GroupTypesModule {}
