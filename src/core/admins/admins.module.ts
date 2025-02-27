import { Module } from '@nestjs/common';
import { AdminsService } from '@admins/admins.service';
import { AdminsController } from '@admins/admins.controller';
import { Admin } from '@admins/entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from '@members/members.module';
import { AccessesModule } from '@accesses/accesses.module';
import { ConfigEnvModule } from '@configuration/configuration.module';

@Module({
  controllers: [AdminsController],
  imports: [
    TypeOrmModule.forFeature([Admin]),
    MembersModule,
    AccessesModule,
    ConfigEnvModule,
  ],
  providers: [AdminsService],
  exports: [TypeOrmModule, AdminsService],
})
export class AdminsModule {}
