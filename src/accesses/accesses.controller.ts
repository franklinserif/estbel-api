import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { AccessesService } from './accesses.service';
import { CreateAccessDto } from './dto/createAccesses.dto';
import { UpdateAccessDto } from './dto/updateAccesses.dto';
import { Accesses } from './entities/accesses.entity';

@Controller('user-module-access')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  /**
   * Creates a new access record.
   *
   * @param {CreateAccessDto} createAccessDto - The data to create the access record.
   * @returns {Promise<Accesses>} The created access record.
   */
  @Post()
  create(@Body() createAccessDto: CreateAccessDto): Promise<Accesses> {
    return this.accessesService.create(createAccessDto);
  }

  /**
   * Retrieves all access records.
   *
   * @returns {Promise<Accesses[]>} A list of all access records.
   */
  @Get()
  findAll(): Promise<Accesses[]> {
    return this.accessesService.findAll();
  }

  /**
   * Retrieves a single access record by its ID.
   *
   * @param {string} id - The ID of the access record to retrieve.
   * @returns {Promise<Accesses>} The found access record.
   * @throws {NotFoundException} If the access record is not found.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Accesses> {
    return this.accessesService.findOne(id);
  }

  /**
   * Updates an existing access record.
   *
   * @param {string} id - The ID of the access record to update.
   * @param {UpdateAccessDto} updateAccessDto - The data to update the access record.
   * @returns {Promise<Accesses>} The updated accesses.
   * @throws {NotFoundException} If the access record is not found.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccessDto: UpdateAccessDto,
  ): Promise<Accesses> {
    return this.accessesService.update(id, updateAccessDto);
  }

  /**
   * Removes an access record by its ID.
   *
   * @param {string} id - The ID of the access record to remove.
   * @returns {Promise<DeleteResult>} The result of the deletion.
   * @throws {NotFoundException} If the access record is not found.
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.accessesService.remove(id);
  }
}
