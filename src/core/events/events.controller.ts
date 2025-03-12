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
import { DeleteResult, UpdateResult } from 'typeorm';
import { QueryParams } from '@common/decorators/query-params.decorator';
import { IQueryParams } from '@common/interfaces/decorators';
import { AttendancesService } from '@attendances/attendances.service';
import { Authorization } from '@common/guards/Authorization.guard';
import { AuthPermission } from '@common/decorators/auth-permission.decorator';
import { MODULES } from '@shared/enums/modules';
import { PERMISSIONS } from '@shared/enums/permissions';
import { idsDto } from '@shared/dtos/ids.dto';
import { Attendance } from '@attendances/entities/attendance.entity';
import { EventsService } from '@events/events.service';
import { ScheduleService } from '@jobs/schedule.service';
import { Event } from '@events/entities/event.entity';
import { CreateEventDto } from '@events/dto/create-event.dto';
import { UpdateEventDto } from '@events/dto/update-event.dto';

@Controller('events')
@UseGuards(Authorization)
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
  @AuthPermission(MODULES.EVENTS, PERMISSIONS.CREATE)
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
  @AuthPermission(MODULES.EVENTS, PERMISSIONS.READ)
  findAll(@QueryParams(Event) queryParams: IQueryParams): Promise<Event[]> {
    return this.eventsService.findAll(queryParams);
  }

  /**
   * Retrieves all scheduled cron jobs.
   *
   * @returns {Array<{ name: string, nextInvocation: string }>} A list of cron jobs with their names and next invocation times.
   */
  @Get('cron-jobs')
  @AuthPermission(MODULES.EVENTS, PERMISSIONS.READ)
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
  @AuthPermission(MODULES.EVENTS, PERMISSIONS.READ)
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
  @AuthPermission(MODULES.EVENTS, PERMISSIONS.CREATE)
  registerAttendance(
    @Param('eventId') eventId: string,
    @Body('memberIds') memberIds: idsDto,
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
  @AuthPermission(MODULES.EVENTS, PERMISSIONS.EDIT)
  confirmAttendance(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UpdateResult> {
    return this.attendancesService.attended(id);
  }

  /**
   * Marks a specific attendance record as non-attendance.
   *
   * @param {string} id - The ID of the attendance record to mark as non-attendance.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  @Patch('attendances/non-attendance/:id')
  @AuthPermission(MODULES.EVENTS, PERMISSIONS.EDIT)
  nonAttendance(@Param('id', ParseUUIDPipe) id: string): Promise<UpdateResult> {
    return this.attendancesService.unattended(id);
  }

  /**
   * Removes a specific attendance record.
   *
   * @param {string} id - The ID of the attendance record to remove.
   * @returns {Promise<DeleteResult>} The result of the removal.
   */
  @Delete('attendances/remove/:id')
  @AuthPermission(MODULES.EVENTS, PERMISSIONS.DELETE)
  removeAttendance(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteResult> {
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
  @AuthPermission(MODULES.EVENTS, PERMISSIONS.READ)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Event> {
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
  @AuthPermission(MODULES.EVENTS, PERMISSIONS.EDIT)
  update(
    @Param('id', ParseUUIDPipe) id: string,
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
  @AuthPermission(MODULES.EVENTS, PERMISSIONS.DELETE)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.eventsService.remove(id);
  }
}
