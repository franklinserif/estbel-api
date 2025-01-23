import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { IQueryParams } from '@common/interfaces/decorators';
import { ScheduleService } from './schedule.service';

@Injectable()
export class EventsService {
  private readonly logger: Logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    private readonly scheduleService: ScheduleService,
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
   *
   * @param {CreateEventDto} createEventDto - The data to create the event.
   * @returns {Promise<Event>} The created event.
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const eventCreated = this.eventRepository.create(createEventDto);
    const event = await this.eventRepository.save(eventCreated);

    const jobInfo = this.scheduleService.scheduleEventNotification(event);

    event.startCronExpression = jobInfo.start.cronExpression;
    event.endCronExpression = jobInfo.end.cronExpression;

    await this.eventRepository.update(event.id, event);

    return event;
  }

  /**
   * Retrieves all events based on the provided query parameters.
   *
   * @param {IQueryParams} queryParams - The query parameters for filtering events.
   * @returns {Promise<Event[]>} A list of events.
   */
  async findAll(queryParams: IQueryParams): Promise<Event[]> {
    return await this.eventRepository.find(queryParams);
  }

  /**
   * Retrieves a single event by its ID.
   *
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
   *
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
      this.scheduleService.updateCronJob(event, newEvent as Event);
    }

    return eventUpdated;
  }

  /**
   * Deletes an event and cancels its scheduled notifications.
   *
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
