import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MemberStatusService } from './member-status.service';
import { CreateMemberStatusDto } from './dto/create-member-status.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';
import { QueryParams } from '@users/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';

@Controller('member-status')
export class MemberStatusController {
  constructor(private readonly memberStatusService: MemberStatusService) {}

  @Post()
  create(@Body() createMemberStatusDto: CreateMemberStatusDto) {
    return this.memberStatusService.create(createMemberStatusDto);
  }

  @Get()
  async findAll(@QueryParams() queryParams: IQueryParams) {
    return this.memberStatusService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberStatusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMemberStatusDto: UpdateMemberStatusDto,
  ) {
    return this.memberStatusService.update(id, updateMemberStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberStatusService.remove(id);
  }
}
