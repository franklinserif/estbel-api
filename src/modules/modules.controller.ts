import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';
import { Module } from './entities/module.entity';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  /**
   * Creates a new module.
   * @param {CreateModuleDto} createModuleDto - The data transfer object containing module creation data.
   * @returns {Promise<Module>} The created module.
   */
  @Post()
  create(@Body() createModuleDto: CreateModuleDto): Promise<Module> {
    return this.modulesService.create(createModuleDto);
  }

  /**
   * Retrieves all modules based on query parameters.
   * @param {IQueryParams} queryParams - The query parameters for filtering and sorting the modules.
   * @returns {Promise<Module[]>} An array of modules.
   */
  @Get()
  findAll(@QueryParams() queryParams: IQueryParams): Promise<Module[]> {
    return this.modulesService.findAll(queryParams);
  }

  /**
   * Retrieves a specific module by its ID.
   * @param {string} id - The ID of the module to retrieve.
   * @returns {Promise<Module>} The retrieved module.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Module> {
    return this.modulesService.findOne(id);
  }

  /**
   * Updates a module by its ID.
   * @param {string} id - The ID of the module to update.
   * @param {UpdateModuleDto} updateModuleDto - The data transfer object containing the updated module data.
   * @returns {Promise<Module>} The updated module.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ): Promise<Module> {
    return this.modulesService.update(id, updateModuleDto);
  }

  /**
   * Deletes a module by its ID.
   * @param {string} id - The ID of the module to delete.
   * @returns {Promise<void>} A promise indicating the completion of the delete operation.
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.modulesService.remove(id);
  }
}
