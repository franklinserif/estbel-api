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

  @Get('attendances')
  findAllAttendances(@QueryParams() queryParams: IQueryParams) {
    return this.eventsService.findAllAttendances(queryParams);
  }

  @Post('attendances/register/:eventId')
  registerAttendance(
    @Param('eventId') eventId: string,
    @Body('memberIds') memberIds: string[],
  ) {
    return this.eventsService.registerAttendance(eventId, memberIds);
  }

  @Patch('attendances/confirm/:id')
  confirmAttendance(@Param('id') id: string) {
    return this.eventsService.confirmAttendance(id);
  }

  @Patch('attendances/non-attendance/:id')
  nonAttendance(@Param('id') id: string) {
    return this.eventsService.nonAttendance(id);
  }

  @Delete('attendances/remove/:id')
  removeAttendance(@Param('id') id: string) {
    return this.eventsService.removeAttendance(id);
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
}
