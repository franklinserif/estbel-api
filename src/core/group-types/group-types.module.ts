import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupTypesService } from '@groupTypes/group-types.service';
import { GroupTypesController } from '@groupTypes/group-types.controller';
import { GroupType } from '@groupTypes/entities/group-types.entity';
import { AdminsModule } from '@admins/admins.module';
import { ConfigurationModule } from '@configuration/configuration.module';

@Module({
  controllers: [GroupTypesController],
  imports: [
    TypeOrmModule.forFeature([GroupType]),
    AdminsModule,
    ConfigurationModule,
  ],
  providers: [GroupTypesService],
  exports: [TypeOrmModule, GroupTypesService],
})
export class GroupTypesModule {}
