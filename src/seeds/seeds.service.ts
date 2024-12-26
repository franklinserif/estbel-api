import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@users/entities/user.entity';
import { users } from './seed/users';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);

  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.query('DELETE FROM "users"');

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.query('DELETE FROM "users"');

      const usersEntities = users.map((userEntity) =>
        queryRunner.manager.create(User, userEntity),
      );

      await queryRunner.manager.save(usersEntities);

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
