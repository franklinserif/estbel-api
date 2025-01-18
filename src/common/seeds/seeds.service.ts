import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { GROUP_TYPES } from './seed/group-types';
import { GROUPS } from './seed/groups';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);

  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.query('DELETE FROM "events"');
    await queryRunner.query('DELETE FROM "attendances"');

    await queryRunner.query('DELETE FROM "access"');
    await queryRunner.query('DELETE FROM "modules"');

    await queryRunner.query('DELETE FROM "members_status"');
    await queryRunner.query('DELETE FROM "groups"');
    await queryRunner.query('DELETE FROM "group_types"');
    await queryRunner.query('DELETE FROM "members"');
    await queryRunner.query('DELETE FROM "users"');
    await queryRunner.query('DELETE FROM "members_groups_groups"');
    await queryRunner.query('DELETE FROM "member_parents"');

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.save('GroupType', GROUP_TYPES);

      const ministeries = await queryRunner.manager.find('GroupType', {
        where: { name: 'Ministerios' },
      });

      const groupsWithTypes = GROUPS.map((group) => ({
        ...group,
        groupTypes: ministeries[0],
      }));

      await queryRunner.manager.save('Group', groupsWithTypes);

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
      await queryRunner.query('DELETE FROM "events"');
      await queryRunner.query('DELETE FROM "attendances"');

      await queryRunner.query('DELETE FROM "access"');
      await queryRunner.query('DELETE FROM "modules"');

      await queryRunner.query('DELETE FROM "members_status"');
      await queryRunner.query('DELETE FROM "groups"');
      await queryRunner.query('DELETE FROM "group_types"');
      await queryRunner.query('DELETE FROM "members"');
      await queryRunner.query('DELETE FROM "users"');
      await queryRunner.query('DELETE FROM "members_groups_groups"');
      await queryRunner.query('DELETE FROM "member_parents"');
    } catch (error) {
      this.logger.error('can drop the database, something went wrong');
      throw error;
    }
  }
}
