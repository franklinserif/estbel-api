import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from './entities/module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  /**
   * Creates a new module and saves it in the database.
   *
   * @param {CreateModuleDto} createModuleDto - The data transfer object for creating a module.
   * @returns {Promise<Module>} The created module.
   */
  async create(createModuleDto: CreateModuleDto): Promise<Module> {
    const module = this.moduleRepository.create(createModuleDto);

    return await this.moduleRepository.save(module);
  }

  /**
   * Retrieves all modules that match the provided query parameters.
   *
   * @param {IQueryParams} queryParams - Query parameters for filtering and sorting modules.
   * @returns {Promise<Module[]>} An array of modules.
   */
  async findAll(queryParams: IQueryParams): Promise<Module[]> {
    const module = await this.moduleRepository.find(queryParams);

    return module;
  }

  /**
   * Retrieves a single module by its ID.
   *
   * @param {string} id - The ID of the module to retrieve.
   * @throws {NotFoundException} If no module with the given ID is found.
   * @returns {Promise<Module>} The retrieved module.
   */
  async findOne(id: string): Promise<Module> {
    const module = await this.moduleRepository.findOne({ where: { id } });
    if (!module?.id) {
      throw new NotFoundException(`Module with id: ${id} not found`);
    }

    return module;
  }

  /**
   * Updates an existing module by its ID.
   *
   * @param {string} id - The ID of the module to update.
   * @param {UpdateModuleDto} updateModuleDto - The data transfer object for updating a module.
   * @throws {NotFoundException} If no module with the given ID is found.
   * @returns {Promise<Module>} The result of the update operation.
   */
  async update(id: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
    await this.findOne(id);

    await this.moduleRepository.update(id, updateModuleDto);

    const updatedModule = await this.moduleRepository.findOne({
      where: { id },
    });

    return updatedModule;
  }

  /**
   * Deletes a module by its ID.
   *
   * @param {string} id - The ID of the module to delete.
   * @throws {NotFoundException} If no module with the given ID is found.
   * @returns {Promise<DeleteResult>} A promise indicating the completion of the delete operation.
   */
  async remove(id: string): Promise<DeleteResult> {
    await this.findOne(id);

    return await this.moduleRepository.delete(id);
  }
}
