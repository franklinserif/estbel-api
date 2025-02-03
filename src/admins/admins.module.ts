import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from '@members/members.module';
import { AccessesModule } from '@accesses/accesses.module';

@Module({
  controllers: [AdminsController],
  imports: [TypeOrmModule.forFeature([Admin]), MembersModule, AccessesModule],
  providers: [AdminsService],
  exports: [TypeOrmModule, AdminsService],
})
export class AdminsModule {}
