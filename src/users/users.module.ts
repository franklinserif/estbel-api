import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModuleAccessModule } from '@user-module-access/user-module-access.module';
import { ModulesModule } from '@modules/modules.module';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModuleAccessModule,
    ModulesModule,
  ],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
