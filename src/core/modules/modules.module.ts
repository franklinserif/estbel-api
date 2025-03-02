import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { Module as ModuleEntity } from './entities/module.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsModule } from '@admins/admins.module';
import { ConfigurationModule } from '@configuration/configuration.module';

@Module({
  controllers: [ModulesController],
  imports: [
    TypeOrmModule.forFeature([ModuleEntity]),
    AdminsModule,
    ConfigurationModule,
  ],
  providers: [ModulesService],
  exports: [TypeOrmModule, ModulesService],
})
export class ModulesModule {}
