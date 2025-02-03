import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';
import { AttendancesService } from './attendances.service';
import { ScheduleService } from './schedule.service';
import { Event } from './entities/event.entity';
import { Attendance } from './entities/attendance.entity';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendancesService: AttendancesService,
    private readonly scheduleService: ScheduleService,
  ) {}

  /**
   * Creates a new event.
   * @param {CreateEventDto} createEventDto - The data to create the event.
   * @returns {Promise<Event>} The created event.
   */
  @Post()
  create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  /**
   * Retrieves all events based on the provided query parameters.
   *
   * @param {IQueryParams} queryParams - The query parameters for filtering events.
   * @returns {Promise<Event[]>} A list of events.
   */
  @Get()
  findAll(@QueryParams() queryParams: IQueryParams): Promise<Event[]> {
    return this.eventsService.findAll(queryParams);
  }

  /**
   * Retrieves all scheduled cron jobs.
   *
   * @returns {Array<{ name: string, nextInvocation: string }>} A list of cron jobs with their names and next invocation times.
   */
  @Get('cron-jobs')
  findCronJobs(): Array<{
    name: string;
    nextInvocation: string;
  }> {
    return this.scheduleService.findAll();
  }

  /**
   * Retrieves all attendances based on the provided query parameters.
   *
   * @param {IQueryParams} queryParams - The query parameters for filtering attendances.
   * @returns {Promise<Attendance[]>} A list of attendances.
   */
  @Get('attendances')
  findAllAttendances(
    @QueryParams() queryParams: IQueryParams,
  ): Promise<Attendance[]> {
    return this.attendancesService.findAll(queryParams);
  }

  /**
   * Registers attendance for a specific event.
   *
   * @param {string} eventId - The ID of the event to register attendance for.
   * @param {string[]} memberIds - The IDs of the members to register.
   * @returns {Promise<Attendance[]>} An array with the attendences.
   */
  @Post('attendances/register/:eventId')
  registerAttendance(
    @Param('eventId') eventId: string,
    @Body('memberIds') memberIds: string[],
  ): Promise<Attendance[]> {
    return this.attendancesService.registerAttendance(eventId, memberIds);
  }

  /**
   * Confirms attendance for a specific attendance record.
   *
   * @param {string} id - The ID of the attendance record to confirm.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  @Patch('attendances/confirm/:id')
  confirmAttendance(@Param('id') id: string): Promise<UpdateResult> {
    return this.attendancesService.attended(id);
  }

  /**
   * Marks a specific attendance record as non-attendance.
   *
   * @param {string} id - The ID of the attendance record to mark as non-attendance.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  @Patch('attendances/non-attendance/:id')
  nonAttendance(@Param('id') id: string): Promise<UpdateResult> {
    return this.attendancesService.unattended(id);
  }

  /**
   * Removes a specific attendance record.
   *
   * @param {string} id - The ID of the attendance record to remove.
   * @returns {Promise<DeleteResult>} The result of the removal.
   */
  @Delete('attendances/remove/:id')
  removeAttendance(@Param('id') id: string): Promise<DeleteResult> {
    return this.attendancesService.remove(id);
  }

  /**
   * Retrieves a single event by its ID.
   *
   * @param {string} id - The ID of the event to retrieve.
   * @throws {NotFoundException} if there is not event with that id throws an not found error
   * @returns {Promise<Event>} The found event.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  /**
   * Updates an existing event.
   *
   * @param {string} id - The ID of the event to update.
   * @param {UpdateEventDto} updateEventDto - The data to update the event.
   * @returns {Promise<Event>} The result of the update operation.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
  }

  /**
   * Deletes an event by its ID.
   *
   * @param {string} id - The ID of the event to delete.
   * @returns {Promise<DeleteResult>} The result of the deletion.
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.eventsService.remove(id);
  }
}
