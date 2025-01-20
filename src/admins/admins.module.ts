import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessesModule } from '@accesses/accesses.module';
import { ModulesModule } from '@modules/modules.module';

@Module({
  controllers: [AdminsController],
  imports: [TypeOrmModule.forFeature([Admin]), AccessesModule, ModulesModule],
  providers: [AdminsService],
  exports: [TypeOrmModule, AdminsService],
})
export class AdminsModule {}
