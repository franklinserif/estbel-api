import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  /**
   * Creates a new admin and assigns default access permissions to all modules.
   *
   * @param {CreateAdminDto} createAdminDto - The data to create the admin.
   * @returns {Promise<Admin>} The created admin.
   */
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const admin = this.adminsRepository.create(createAdminDto);

    const createdAdmin = await this.adminsRepository.save({ ...admin });

    return createdAdmin;
  }

  /**
   * Retrieves all admins based on the provided query parameters.
   *
   * @param {IQueryParams} queryParams - The query parameters for filtering admins.
   * @returns {Promise<Admin[]>} A list of admins.
   */
  async findAll(queryParams: IQueryParams): Promise<Admin[]> {
    return await this.adminsRepository.find(queryParams);
  }

  /**
   * Retrieves a single admin by their ID.
   *
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
   *
   * @param {string} id - The ID of the admin to update.
   * @param {UpdateAdminDto} updateAdminDto - The data to update the admin.
   * @returns {Promise<Admin>} The updated admin.
   * @throws {NotFoundException} If the admin is not found.
   */
  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    await this.findOne(id);
    await this.adminsRepository.update(id, updateAdminDto);

    return await this.findOne(id);
  }

  /**
   * Removes an admin by their ID.
   *
   * @param {string} id - The ID of the admin to remove.
   * @returns {Promise<DeleteResult>} The result of the deletion operation.
   * @throws {NotFoundException} If the admin is not found.
   */
  async remove(id: string): Promise<DeleteResult> {
    await this.findOne(id);
    return await this.adminsRepository.delete(id);
  }
}
