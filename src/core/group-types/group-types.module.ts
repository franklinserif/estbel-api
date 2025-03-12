import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '@configuration/configuration.module';
import { GroupType } from '@groupTypes/entities/group-types.entity';
import { GroupTypesService } from '@groupTypes/group-types.service';
import { GroupTypesController } from '@groupTypes/group-types.controller';
import { AuthModule } from '@auth/auth.module';
import { AdminsModule } from '@admins/admins.module';

@Module({
  controllers: [GroupTypesController],
  imports: [
    TypeOrmModule.forFeature([GroupType]),
    forwardRef(() => AuthModule),
    forwardRef(() => AdminsModule),
    ConfigurationModule,
  ],
  providers: [GroupTypesService],
  exports: [TypeOrmModule, GroupTypesService],
})
export class GroupTypesModule {}
