import { Module } from '@nestjs/common';
import { UserModuleAccessService } from './user-module-access.service';
import { UserModuleAccessController } from './user-module-access.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModuleAccess } from './entities/user-module-access.entity';

@Module({
  controllers: [UserModuleAccessController],
  imports: [TypeOrmModule.forFeature([UserModuleAccess])],
  providers: [UserModuleAccessService],
})
export class UserModuleAccessModule {}
