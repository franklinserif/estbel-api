import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { generateTemporaryPassword, hashPassword } from '@common/libs/password';
import { IQueryParams } from '@common/interfaces/decorators';
import { Module } from '@modules/entities/module.entity';
import { Accesses } from '@accesses/entities/accesses.entity';
import { Member } from '@members/entities/member.entity';
import { GeneratedPasswordDto } from '@emails/dtos/generatedPassword.dto';
import { NewAccountEmailDto } from '@emails/dtos/NewAccountEmail.dto';
import { Admin } from '@admins/entities/admin.entity';
import { AdminsEvents } from '@admins/enums/admins';
import { CreateAdminDto } from '@admins/dto/create-admin.dto';
import { UpdateAdminDto } from '@admins/dto/update-admin.dto';

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
    const { id, email } = createAdminDto;

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

      const admin = this.adminRepository.create({
        id,
        member,
        password,
        email,
      });

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

      this.eventEmitter.emit(AdminsEvents.CREATE, {
        to: admin.member.email,
        firstName: admin.member.firstName,
        password: admin.password,
        email: admin.member.email,
      } as NewAccountEmailDto);

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
   * Retrieves a single admin by their Email.
   * @param {string} email - The email of the admin to retrieve.
   * @returns {Promise<Admin>} The found admin.
   * @throws {NotFoundException} If the admin is not found.
   */
  async findByEmail(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { email },
      select: ['password', 'id'],
    });

    if (!admin?.id) {
      throw new NotFoundException(`Admin with email: ${email} not found`);
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

    const hashedPassword = await hashPassword(updateAdminDto.password);
    await this.adminRepository.update(id, {
      ...updateAdminDto,
      password: hashedPassword,
    });

    const admin = await this.findOne(id);

    this.eventEmitter.emit(AdminsEvents.UPDATE, {
      email: admin.member.email,
      firstName: admin.member.firstName,
      password: admin.password,
    } as GeneratedPasswordDto);

    return admin;
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
