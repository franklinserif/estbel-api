import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccessDto } from './dto/createAccesses.dto';
import { UpdateAccessDto } from './dto/updateAccesses.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Accesses } from './entities/accesses.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class AccessesService {
  constructor(
    @InjectRepository(Accesses)
    private readonly accessesRepository: Repository<Accesses>,
  ) {}

  /**
   * Creates a new access record.
   *
   * @param {CreateAccessDto} createAccessDto - The data to create the access record.
   * @returns {Promise<Accesses>} The created access record.
   */
  async create(createAccessDto: CreateAccessDto): Promise<Accesses> {
    const access = this.accessesRepository.create(createAccessDto);

    return await this.accessesRepository.save(access);
  }

  /**
   * Retrieves all access records.
   *
   * @returns {Promise<Accesses[]>} A list of all access records.
   */
  async findAll(): Promise<Accesses[]> {
    return await this.accessesRepository.find();
  }

  /**
   * Retrieves a single access record by its ID.
   *
   * @param {string} id - The ID of the access record to retrieve.
   * @returns {Promise<Accesses>} The found access record.
   * @throws {NotFoundException} If the access record is not found.
   */
  async findOne(id: string): Promise<Accesses> {
    const access = await this.accessesRepository.findOne({ where: { id } });

    if (!access?.id) {
      throw new NotFoundException(`Access record with id: ${id} not found`);
    }

    return access;
  }

  /**
   * Updates an existing access record.
   *
   * @param {string} id - The ID of the access record to update.
   * @param {UpdateAccessDto} updateAccessDto - The data to update the access record.
   * @returns {Promise<Access>} The updated accesses.
   * @throws {NotFoundException} If the access record is not found.
   */
  async update(
    id: string,
    updateAccessDto: UpdateAccessDto,
  ): Promise<Accesses> {
    await this.findOne(id);

    await this.accessesRepository.update(id, updateAccessDto);

    return await this.findOne(id);
  }

  /**
   * Removes an access record by its ID.
   *
   * @param {string} id - The ID of the access record to remove.
   * @returns {Promise<DeleteResult>} The result of the deletion.
   * @throws {NotFoundException} If the access record is not found.
   */
  async remove(id: string): Promise<DeleteResult> {
    await this.findOne(id);

    return await this.accessesRepository.delete(id);
  }
}
