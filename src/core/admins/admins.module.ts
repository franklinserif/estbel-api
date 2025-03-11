import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from '@members/members.module';
import { AccessesModule } from '@accesses/accesses.module';
import { ConfigurationModule } from '@configuration/configuration.module';
import { Admin } from '@admins/entities/admin.entity';
import { AdminsController } from '@admins/admins.controller';
import { AdminsService } from '@admins/admins.service';

@Module({
  controllers: [AdminsController],
  imports: [
    TypeOrmModule.forFeature([Admin]),
    MembersModule,
    AccessesModule,
    ConfigurationModule,
  ],
  providers: [AdminsService],
  exports: [TypeOrmModule, AdminsService],
})
export class AdminsModule {}
