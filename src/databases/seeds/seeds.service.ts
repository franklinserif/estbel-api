import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { GROUP_TYPES } from './mock/group-types';
import { GROUPS } from './mock/groups';
import { MEMBERS_STATUS } from './mock/member-types';
import { MEMBERS } from './mock/members';
import { MODULES } from './mock/modules';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Runs the seeding process to populate the database with initial data.
   * @returns {Promise<void>}
   * @throws {Error} If the seeding process fails.
   */
  async run(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.clearDatabase(queryRunner);

      await queryRunner.manager.save('GroupType', GROUP_TYPES);

      const ministeries = await queryRunner.manager.find('GroupType', {
        where: { name: 'Ministerios' },
      });

      const groupsWithTypes = GROUPS.map((group) => ({
        ...group,
        groupType: ministeries[0],
      }));

      await queryRunner.manager.save('Group', groupsWithTypes);

      const membersStatusCreated = await queryRunner.manager.save(
        'members_status',
        MEMBERS_STATUS,
      );

      const membersWithStatus = MEMBERS.map((member) => ({
        ...member,
        memberStatus: membersStatusCreated[Math.floor(Math.random() * 3)],
      }));

      await queryRunner.manager.save('members', membersWithStatus);

      await queryRunner.manager.save('modules', MODULES);

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

  /**
   * Clears all data from the database.
   * @returns {Promise<void>}
   * @throws {Error} If the database clearing process fails.
   */
  async drop(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Clear existing data
      await this.clearDatabase(queryRunner);

      await queryRunner.commitTransaction();
      this.logger.log('Database cleared successfully');
    } catch (error) {
      this.logger.error('Failed to clear the database', error.message);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Clears all data from the database tables.
   * @param {QueryRunner} queryRunner - The query runner instance.
   * @returns {Promise<void>}
   */
  private async clearDatabase(queryRunner: any): Promise<void> {
    await queryRunner.query('DELETE FROM "events"');
    await queryRunner.query('DELETE FROM "attendances"');
    await queryRunner.query('DELETE FROM "access"');
    await queryRunner.query('DELETE FROM "modules"');
    await queryRunner.query('DELETE FROM "members_status"');
    await queryRunner.query('DELETE FROM "groups"');
    await queryRunner.query('DELETE FROM "group_types"');
    await queryRunner.query('DELETE FROM "members"');
    await queryRunner.query('DELETE FROM "admins"');
    await queryRunner.query('DELETE FROM "members_groups_groups"');
    await queryRunner.query('DELETE FROM "member_parents"');
  }
}
