import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MemberStatusService } from './member-status.service';
import { CreateMemberStatusDto } from './dto/create-member-status.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';

@Controller('member-status')
export class MemberStatusController {
  constructor(private readonly memberStatusService: MemberStatusService) {}

  @Post()
  create(@Body() createMemberStatusDto: CreateMemberStatusDto) {
    return this.memberStatusService.create(createMemberStatusDto);
  }

  @Get()
  findAll() {
    return this.memberStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberStatusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberStatusDto: UpdateMemberStatusDto) {
    return this.memberStatusService.update(+id, updateMemberStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberStatusService.remove(+id);
  }
}
