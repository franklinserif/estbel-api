import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupTypesService } from './group-types.service';
import { CreateGroupTypesDto } from './dto/create-group-types.dto';
import { UpdateGroupTypesDto } from './dto/update-group-types.dto';

@Controller('group-types')
export class GroupTypesController {
  constructor(private readonly groupTypesService: GroupTypesService) {}

  @Post()
  create(@Body() createGroupTypesDto: CreateGroupTypesDto) {
    return this.groupTypesService.create(createGroupTypesDto);
  }

  @Get()
  findAll() {
    return this.groupTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupTypesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupTypesDto: UpdateGroupTypesDto,
  ) {
    return this.groupTypesService.update(+id, updateGroupTypesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupTypesService.remove(+id);
  }
}
