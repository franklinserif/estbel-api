import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsModule } from '@admins/admins.module';
import { ConfigurationModule } from '@configuration/configuration.module';
import { GroupType } from '@groupTypes/entities/group-types.entity';
import { GroupTypesService } from '@groupTypes/group-types.service';
import { GroupTypesController } from '@groupTypes/group-types.controller';

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
