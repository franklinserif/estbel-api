import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Member } from '@members/entities/member.entity';
import { Accesses } from '@accesses/entities/accesses.entity';
import { Module } from '@modules/entities/module.entity';
import { IQueryParams } from '@common/interfaces/decorators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminsEvents } from './enums/admins';

@Injectable()
export class AdminsService {
  private readonly logger: Logger = new Logger(AdminsService.name);
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Accesses)
    private readonly accessRepository: Repository<Accesses>,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Creates a new admin and assigns default access permissions to all modules.
   * @param {CreateAdminDto} createAdminDto - The data to create the admin.
   * @returns {Promise<Admin>} The created admin.
   */
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { id } = createAdminDto;

    const queryRunner =
      this.adminRepository.manager.connection.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      const adminFound = await queryRunner.manager.findOne(Admin, {
        where: { id: id },
      });

      if (adminFound) {
        throw new Error('This member already has an associated admin');
      }

      const member = await queryRunner.manager.findOne(Member, {
        where: { id: id },
      });

      if (!member) {
        throw new Error('Member not found');
      }

      const password = generateTemporaryPassword();

      const admin = this.adminRepository.create({ id, member, password });
      await queryRunner.manager.save(admin);

      const modules = await queryRunner.manager.find(Module);

      const defaultAccesses = modules.map((module) => {
        return this.accessRepository.create({
          admin,
          module,
          canRead: true,
          canEdit: false,
          canDelete: false,
          canPrint: false,
        });
      });

      await queryRunner.manager.save(Accesses, defaultAccesses);
      await queryRunner.commitTransaction();

      this.eventEmitter.emit(AdminsEvents.CREATE, admin);

      return admin;
    } catch (error) {
      this.logger.error(
        `Something went wrong creating a new admin account ${error} `,
      );
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Retrieves all admins based on the provided query parameters.
   * @param {IQueryParams} queryParams - The query parameters for filtering admins.
   * @returns {Promise<Admin[]>} A list of admins.
   */
  async findAll(queryParams: IQueryParams): Promise<Admin[]> {
    return await this.adminRepository.find(queryParams);
  }

  /**
   * Retrieves a single admin by their ID.
   * @param {string} id - The ID of the admin to retrieve.
   * @returns {Promise<Admin>} The found admin.
   * @throws {NotFoundException} If the admin is not found.
   */
  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['accesses'],
    });

    if (!admin?.id) {
      throw new NotFoundException(`Admin with id: ${id} not found`);
    }

    return admin;
  }

  /**
   * Updates an existing admin.
   * @param {string} id - The ID of the admin to update.
   * @param {UpdateAdminDto} updateAdminDto - The data to update the admin.
   * @returns {Promise<Admin>} The updated admin.
   * @throws {NotFoundException} If the admin is not found.
   */
  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    await this.findOne(id);
    await this.adminRepository.update(id, updateAdminDto);

    return await this.findOne(id);
  }

  /**
   * Removes an admin by their ID.
   * @param {string} id - The ID of the admin to remove.
   * @returns {Promise<DeleteResult>} The result of the deletion operation.
   * @throws {NotFoundException} If the admin is not found.
   */
  async remove(id: string): Promise<DeleteResult> {
    await this.findOne(id);

    return await this.adminRepository.delete(id);
  }
}
