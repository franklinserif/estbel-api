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
import { AccessesService } from '@accesses/accesses.service';
import { CreateAccessDto } from '@accesses/dto/createAccesses.dto';
import { UpdateAccessDto } from '@accesses/dto/updateAccesses.dto';
import { Accesses } from '@accesses/entities/accesses.entity';
import { Authorization } from '@common/guards/Authorization.guard';
import { AuthPermission } from '@common/decorators/auth-permission.decorator';
import { MODULES } from '@shared/enums/modules';
import { PERMISSIONS } from '@shared/enums/permissions';

@Controller('user-module-access')
@UseGuards(Authorization)
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  /**
   * Creates a new access record.
   * @param {CreateAccessDto} createAccessDto - The data to create the access record.
   * @returns {Promise<Accesses>} The created access record.
   */
  @Post()
  @AuthPermission(MODULES.ADMINS, PERMISSIONS.CREATE)
  create(@Body() createAccessDto: CreateAccessDto): Promise<Accesses> {
    return this.accessesService.create(createAccessDto);
  }

  /**
   * Retrieves all access records.
   * @returns {Promise<Accesses[]>} A list of all access records.
   */
  @Get()
  @AuthPermission(MODULES.ADMINS, PERMISSIONS.READ)
  findAll(): Promise<Accesses[]> {
    return this.accessesService.findAll();
  }

  /**
   * Retrieves a single access record by its ID.
   * @param {string} id - The ID of the access record to retrieve.
   * @returns {Promise<Accesses>} The found access record.
   * @throws {NotFoundException} If the access record is not found.
   */
  @Get(':id')
  @AuthPermission(MODULES.ADMINS, PERMISSIONS.READ)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Accesses> {
    return this.accessesService.findOne(id);
  }

  /**
   * Updates an existing access record.
   * @param {string} id - The ID of the access record to update.
   * @param {UpdateAccessDto} updateAccessDto - The data to update the access record.
   * @returns {Promise<Accesses>} The updated accesses.
   * @throws {NotFoundException} If the access record is not found.
   */
  @Patch(':id')
  @AuthPermission(MODULES.ADMINS, PERMISSIONS.EDIT)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAccessDto: UpdateAccessDto,
  ): Promise<Accesses> {
    return this.accessesService.update(id, updateAccessDto);
  }

  /**
   * Removes an access record by its ID.
   * @param {string} id - The ID of the access record to remove.
   * @returns {Promise<DeleteResult>} The result of the deletion.
   * @throws {NotFoundException} If the access record is not found.
   */
  @Delete(':id')
  @AuthPermission(MODULES.ADMINS, PERMISSIONS.DELETE)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.accessesService.remove(id);
  }
}
