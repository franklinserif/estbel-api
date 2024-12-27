import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserModuleAccessService } from './user-module-access.service';
import { CreateUserModuleAccessDto } from './dto/create-user-module-access.dto';
import { UpdateUserModuleAccessDto } from './dto/update-user-module-access.dto';

@Controller('user-module-access')
export class UserModuleAccessController {
  constructor(
    private readonly userModuleAccessService: UserModuleAccessService,
  ) {}

  @Post()
  create(@Body() createUserModuleAccessDto: CreateUserModuleAccessDto) {
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
    @Body() updateUserModuleAccessDto: UpdateUserModuleAccessDto,
  ) {
    return this.userModuleAccessService.update(id, updateUserModuleAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userModuleAccessService.remove(id);
  }
}
