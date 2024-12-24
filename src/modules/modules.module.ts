import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { Module as ModuleEntity } from './entities/module.entity';
import { UserModuleAccess } from './entities/user-module-access.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ModulesController],
  imports: [TypeOrmModule.forFeature([ModuleEntity, UserModuleAccess])],
  providers: [ModulesService],
  exports: [TypeOrmModule],
})
export class ModulesModule {}
