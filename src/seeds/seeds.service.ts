import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@users/entities/user.entity';
import { users } from './seed/users';
import { Module } from '@modules/entities/module.entity';
import { modules } from './seed/modules';
import { user_module_access } from './seed/user_module_access';
import { Accesses } from '@accesses/entities/accesses.entity';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);

  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.query('DELETE FROM "access"');
    await queryRunner.query('DELETE FROM "modules"');
    await queryRunner.query('DELETE FROM "users"');

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const modulesEntities = modules.map((moduleEntity) =>
        queryRunner.manager.create(Module, moduleEntity),
      );
      const modulesResults = await queryRunner.manager.save(modulesEntities);

      const usersEntities = users.map((userEntity) =>
        queryRunner.manager.create(User, userEntity),
      );
      const usersResults = await queryRunner.manager.save(usersEntities);

      // Crear y guardar accesos
      const userModuleAccessEntities = usersResults.flatMap((user) =>
        Array.from({ length: 3 }).map(() => {
          const userModuleAccessIndex = Math.floor(
            Math.random() * user_module_access.length,
          );
          const moduleIndex = Math.floor(Math.random() * modulesResults.length);

          const UMA = new Accesses();
          UMA.canEdit = user_module_access[userModuleAccessIndex].canEdit;
          UMA.canDelete = user_module_access[userModuleAccessIndex].canDelete;
          UMA.canRead = user_module_access[userModuleAccessIndex].canRead;
          UMA.canPrint = user_module_access[userModuleAccessIndex].canPrint;
          UMA.module = modulesResults[moduleIndex];
          UMA.user = user;

          return queryRunner.manager.create(Accesses, UMA);
        }),
      );
      await queryRunner.manager.save(userModuleAccessEntities);

      await queryRunner.commitTransaction();
      this.logger.log('Seeds executed successfully');
    } catch (error) {
      this.logger.error(`Failed to execute seeds: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async drop() {
    try {
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.query('DELETE FROM "access"');
      await queryRunner.query('DELETE FROM "modules"');
      await queryRunner.query('DELETE FROM "users"');
    } catch (error) {
      this.logger.error('can drop the database, something went wrong1');
      throw error;
    }
  }
}
