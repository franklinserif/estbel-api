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
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';
import { Admin } from './entities/admin.entity';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  /**
   * Creates a new admin.
   * @param {CreateAdminDto} createAdminDto - The data to create the admin.
   * @returns {Promise<Admin>} The created admin.
   */
  @Post()
  create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminsService.create(createAdminDto);
  }

  /**
   * Retrieves all admins based on the provided query parameters.
   * @param {IQueryParams} queryParams - The query parameters for filtering admins.
   * @returns {Promise<Admin[]>} A list of admins.
   */
  @Get()
  findAll(
    @QueryParams()
    queryParams: IQueryParams,
  ): Promise<Admin[]> {
    return this.adminsService.findAll(queryParams);
  }

  /**
   * Retrieves a single admin by their ID.
   * @param {string} id - The ID of the admin to retrieve.
   * @returns {Promise<Admin>} The found admin.
   * @throws {NotFoundException} If the admin is not found.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Admin> {
    return this.adminsService.findOne(id);
  }

  /**
   * Updates an existing admin.
   * @param {string} id - The ID of the admin to update.
   * @param {UpdateAdminDto} updateAdminDto - The data to update the admin.
   * @returns {Promise<Admin>} The admin updated.
   * @throws {NotFoundException} If the admin is not found.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    return this.adminsService.update(id, updateAdminDto);
  }

  /**
   * Removes an admin by their ID.
   * @param {string} id - The ID of the admin to remove.
   * @returns {Promise<DeleteResult>} The result of the deletion operation.
   * @throws {NotFoundException} If the admin is not found.
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.adminsService.remove(id);
  }
}
