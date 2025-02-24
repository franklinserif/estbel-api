import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { Module as ModuleEntity } from './entities/module.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ModulesController],
  imports: [TypeOrmModule.forFeature([ModuleEntity])],
  providers: [ModulesService],
  exports: [TypeOrmModule, ModulesService],
})
export class ModulesModule {}
