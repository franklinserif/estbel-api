import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryParams } from '@users/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll(@QueryParams() queryParams: IQueryParams) {
    return this.eventsService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Post('register-attendance/:eventId/:memberIds')
  registerAttendance(
    @Param('eventId') eventId: string,
    @Body('memberIds') memberIds: string[],
  ) {
    return this.eventsService.registerAttendance(eventId, memberIds);
  }

  @Post('confirm-attendance/:id')
  confirmAttendance(@Param('id') id: string) {
    return this.confirmAttendance(id);
  }

  @Post('non-attendance/:id')
  nonAttendance(@Param('id') id: string) {
    return this.nonAttendance(id);
  }
}
