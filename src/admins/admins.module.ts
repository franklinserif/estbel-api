import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AdminsController],
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminsService],
  exports: [TypeOrmModule, AdminsService],
})
export class AdminsModule {}
