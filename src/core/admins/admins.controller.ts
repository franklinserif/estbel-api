import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';
import { MODULES } from '@shared/enums/modules';
import { Authorization } from '@common/guards/Authorization.guard';
import { AuthPermission } from '@common/decorators/auth-permission.decorator';
import { PERMISSIONS } from '@shared/enums/permissions';
import { UpdateAdminDto } from '@admins/dto/update-admin.dto';
import { CreateAdminDto } from '@admins/dto/create-admin.dto';
import { AdminsService } from '@admins/admins.service';
import { Admin } from '@admins/entities/admin.entity';

@Controller('admins')
@UseGuards(Authorization)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  /**
   * Creates a new admin.
   * @param {CreateAdminDto} createAdminDto - The data to create the admin.
   * @returns {Promise<Admin>} The created admin.
   */
  @Post()
  @AuthPermission(MODULES.ADMINS, PERMISSIONS.CREATE)
  create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminsService.create(createAdminDto);
  }

  /**
   * Retrieves all admins based on the provided query parameters.
   * @param {IQueryParams} queryParams - The query parameters for filtering admins.
   * @returns {Promise<Admin[]>} A list of admins.
   */
  @Get()
  @AuthPermission(MODULES.ADMINS, PERMISSIONS.READ)
  findAll(
    @QueryParams(Admin)
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
  @AuthPermission(MODULES.ADMINS, PERMISSIONS.READ)
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
  @AuthPermission(MODULES.ADMINS, PERMISSIONS.EDIT)
  update(
    @Param('id', ParseUUIDPipe) id: string,
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
  @AuthPermission(MODULES.ADMINS, PERMISSIONS.DELETE)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.adminsService.remove(id);
  }
}
