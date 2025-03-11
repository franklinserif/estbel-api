import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobInfo } from '@common/interfaces/schedule';
import { IQueryParams } from '@common/interfaces/decorators';
import { EnumEvent } from '@events/enum/event';
import { Event } from '@events/entities/event.entity';
import { ScheduleService } from '@jobs/schedule.service';
import { CreateEventDto } from '@events/dto/create-event.dto';
import { UpdateEventDto } from '@events/dto/update-event.dto';

@Injectable()
export class EventsService {
  private readonly logger: Logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly scheduleService: ScheduleService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Initializes the module by loading existing events and scheduling cron jobs.
   */
  async onModuleInit(): Promise<void> {
    const events = await this.eventRepository.find();

    if (events?.length > 0) {
      this.scheduleService.addCronJobs(events);
      this.logger.log('All events were registered');
    } else {
      this.logger.log(`There's not event to be registered`);
    }
  }

  /**
   * Creates a new event and schedules its notifications.
   * @param {CreateEventDto} createEventDto - The data to create the event.
   * @returns {Promise<Event>} The created event.
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const eventCreated = this.eventRepository.create(createEventDto);

    // this will emit an event (EVENT_CREATE) and the schedule services
    // it will register an job for that event and return the information
    const emittersResult = await Promise.all([
      this.eventEmitter.emitAsync(EnumEvent.EVENT_CREATED, eventCreated),
    ] as any);

    // information from the schedule services
    const job = emittersResult[0][0] as unknown as JobInfo;

    eventCreated!.startCronExpression = job.start.cronExpression;
    eventCreated!.endCronExpression = job.end.cronExpression;

    const event = await this.eventRepository.save(eventCreated);

    return event;
  }

  /**
   * Retrieves all events based on the provided query parameters.
   * @param {IQueryParams} queryParams - The query parameters for filtering events.
   * @returns {Promise<Event[]>} A list of events.
   */
  async findAll(queryParams: IQueryParams): Promise<Event[]> {
    return await this.eventRepository.find(queryParams);
  }

  /**
   * Retrieves a single event by its ID.
   * @param {string} id - The ID of the event to retrieve.
   * @returns {Promise<Event>} The found event.
   * @throws {NotFoundException} If the event is not found.
   */
  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event?.id) {
      throw new NotFoundException(`Event with id: ${id} not found`);
    }

    return event;
  }

  /**
   * Updates an existing event and reschedules its notifications if necessary.
   * @param {string} id - The ID of the event to update.
   * @param {UpdateEventDto} updateEventDto - The data to update the event.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async update(id: string, updateEventDto: UpdateEventDto): Promise<any> {
    const event = await this.findOne(id);

    const eventUpdated = await this.eventRepository.update(id, updateEventDto);

    if (
      event.startTime !== updateEventDto.startTime ||
      event.endTime !== updateEventDto.endTime ||
      event.repeat !== updateEventDto.repeat
    ) {
      const newEvent = { ...event, ...updateEventDto };

      this.eventEmitter.emit(EnumEvent.EVENT_UPDATED, {
        old: event,
        new: newEvent,
      });
    }

    return eventUpdated;
  }

  /**
   * Deletes an event and cancels its scheduled notifications.
   * @param {string} id - The ID of the event to delete.
   * @returns {Promise<DeleteResult>} The result of the delete operation.
   */
  async remove(id: string): Promise<any> {
    const event = await this.findOne(id);

    const deletedResult = await this.eventRepository.delete(id);
    this.scheduleService.cancelEvent(event);

    return deletedResult;
  }
}
