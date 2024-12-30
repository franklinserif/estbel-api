import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
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

  async create(createModuleDto: CreateModuleDto) {
    const module = this.moduleRepository.create(createModuleDto);

    return await this.moduleRepository.save(module);
  }

  async findAll(queryParams: IQueryParams) {
    const module = await this.moduleRepository.find(queryParams);

    return module;
  }

  async findOne(id: string) {
    const module = await this.moduleRepository.findOne({ where: { id } });

    if (!module?.id) {
      throw new NotFoundException(`Module with id: ${id} not found`);
    }

    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    await this.findOne(id);

    const updatedModule = await this.moduleRepository.update(
      id,
      updateModuleDto,
    );

    return updatedModule;
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.moduleRepository.delete(id);
  }
}
