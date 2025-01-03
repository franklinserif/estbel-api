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
import { AttendancesService } from './attendances.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendancesService: AttendancesService,
  ) {}

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
    return this.attendancesService.findAll(queryParams);
  }

  @Post('attendances/register/:eventId')
  registerAttendance(
    @Param('eventId') eventId: string,
    @Body('memberIds') memberIds: string[],
  ) {
    return this.attendancesService.registerAttendance(eventId, memberIds);
  }

  @Patch('attendances/confirm/:id')
  confirmAttendance(@Param('id') id: string) {
    return this.attendancesService.attended(id);
  }

  @Patch('attendances/non-attendance/:id')
  nonAttendance(@Param('id') id: string) {
    return this.attendancesService.unattended(id);
  }

  @Delete('attendances/remove/:id')
  removeAttendance(@Param('id') id: string) {
    return this.attendancesService.remove(id);
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
