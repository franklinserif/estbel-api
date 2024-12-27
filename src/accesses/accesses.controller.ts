import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { CreateAccessDto } from './dto/createAccesses.dto';
import { UpdateAccessDto } from './dto/updateAccesses.dto';

@Controller('user-module-access')
export class AccessesController {
  constructor(private readonly userModuleAccessService: AccessesService) {}

  @Post()
  create(@Body() createUserModuleAccessDto: CreateAccessDto) {
    return this.userModuleAccessService.create(createUserModuleAccessDto);
  }

  @Get()
  findAll() {
    return this.userModuleAccessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userModuleAccessService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserModuleAccessDto: UpdateAccessDto,
  ) {
    return this.userModuleAccessService.update(id, updateUserModuleAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userModuleAccessService.remove(id);
  }
}
