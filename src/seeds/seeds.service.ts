import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@users/entities/user.entity';
import { users } from './seed/users';
import { Module } from '@modules/entities/module.entity';
import { modules } from './seed/modules';
import { user_module_access } from './seed/user_module_access';
import { UserModuleAccess } from '@modules/entities/user-module-access.entity';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);

  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.query('DELETE FROM "users"');
    await queryRunner.query('DELETE FROM "modules"');
    await queryRunner.query('DELETE FROM "user_module_access"');

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.query('DELETE FROM "users"');

      const modulesEntities = modules.map((moduleEntity) =>
        queryRunner.manager.create(Module, moduleEntity),
      );

      const modulesResults = await queryRunner.manager.save(modulesEntities);

      const usersEntities = users.map((userEntity) =>
        queryRunner.manager.create(User, userEntity),
      );

      const usersModify = usersEntities.map((user) => {
        const userModuleAccess = user.userModuleAccess.map(
          (userModuleAccess) => {
            const userModuleAccessIndex = Math.floor(Math.random() * 8) + 0;
            const moduleIndex = Math.floor(Math.random() * 2) + 0;

            const UMA = {
              ...user_module_access[userModuleAccessIndex],
              module: modulesResults[moduleIndex],
            };

            const result = queryRunner.manager.create(UserModuleAccess, UMA);
            return result;
          },
        );
        user.userModuleAccess = userModuleAccess;

        return user;
      });
      await queryRunner.manager.save(usersModify);

      await queryRunner.commitTransaction();
      this.logger.log('Seeds executed succesfully');
    } catch (error) {
      this.logger.log(`Can't execute seeds, queryRunner was release`);

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
