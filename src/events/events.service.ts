import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { IQueryParams } from '@common/interfaces/decorators';
import { ScheduleService } from './schedule.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly scheduleService: ScheduleService,
  ) {}

  async onModuleInit() {
    const events = await this.eventRepository.find();

    if (events?.length > 0) {
      this.scheduleService.addCronJobs(events);
    }
  }

  async create(createEventDto: CreateEventDto) {
    let jobInfo = null;

    try {
      const eventCreated = this.eventRepository.create(createEventDto);

      jobInfo = this.scheduleService.scheduleEventNotification(eventCreated);

      eventCreated.cronExpression = jobInfo.cronExpression;

      const event = await this.eventRepository.save(eventCreated);

      return event;
    } catch (error) {
      if (jobInfo?.jobKey) {
        this.scheduleService.cancelEvent(jobInfo?.jobKey);
      }
      throw error;
    }
  }

  async findAll(queryParams: IQueryParams) {
    return await this.eventRepository.find(queryParams);
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event?.id) {
      throw new NotFoundException(`event with id: ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);
    const eventUpdated = await this.eventRepository.update(id, updateEventDto);

    if (
      event.startTime != updateEventDto.startTime ||
      event.endTime !== updateEventDto.endTime ||
      event.repeat !== updateEventDto.repeat
    ) {
      const newEvent = { ...event, ...updateEventDto };
      this.scheduleService.updateCronJob(event, newEvent as Event);
    }

    return eventUpdated;
  }

  async remove(id: string) {
    const event = await this.findOne(id);

    const deletedResult = await this.eventRepository.delete(id);

    this.scheduleService.cancelEvent(event);

    return deletedResult;
  }
}
