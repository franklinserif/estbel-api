import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = this.eventRepository.create(createEventDto);

    return await this.eventRepository.save(event);
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
    await this.findOne(id);

    return await this.eventRepository.update(id, updateEventDto);
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.eventRepository.delete(id);
  }
}
