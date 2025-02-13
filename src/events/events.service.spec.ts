import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ScheduleService } from './schedule.service';
import { EnumEvent } from './enum/event';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: Repository<Event>;
  let scheduleService: ScheduleService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository,
        },
        {
          provide: ScheduleService,
          useValue: {
            addCronJobs: jest.fn(),
            cancelEvent: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emitAsync: jest.fn().mockResolvedValue([[]]),
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    scheduleService = module.get<ScheduleService>(ScheduleService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should load events and schedule cron jobs', async () => {
      const events = [{ id: '1', name: 'Test Event' }] as Event[];
      jest.spyOn(eventRepository, 'find').mockResolvedValue(events);

      await service.onModuleInit();

      expect(eventRepository.find).toHaveBeenCalled();
      expect(scheduleService.addCronJobs).toHaveBeenCalledWith(events);
    });
  });

  describe('create', () => {
    it('should create an event and emit EVENT_CREATED', async () => {
      const createEventDto: CreateEventDto = {
        id: '1',
        name: 'New Event',
        description: 'Description',
        address: '123 Street',
        location: 'City',
        repeat: false,
        startTime: new Date(),
        endTime: new Date(),
      };

      const event = {
        ...createEventDto,
        startCronExpression: '* * * * *',
        endCronExpression: '* * * * *',
      } as Event;

      // Mock repository methods
      jest.spyOn(eventRepository, 'create').mockReturnValue(event);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);

      // Corrected emitAsync mock: returns [JobInfo], not [[JobInfo]]
      jest.spyOn(eventEmitter, 'emitAsync').mockResolvedValue([
        {
          start: { cronExpression: '* * * * *', jobKey: 'startJobKey' },
          end: { cronExpression: '* * * * *', jobKey: 'endJobKey' },
        },
      ]);

      const result = await service.create(createEventDto);

      // Assertions
      expect(eventRepository.create).toHaveBeenCalledWith(createEventDto);
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        EnumEvent.EVENT_CREATED,
        event,
      );
      expect(eventRepository.save).toHaveBeenCalledWith(event);
      expect(result.startCronExpression).toBe('* * * * *');
      expect(result.endCronExpression).toBe('* * * * *');
    });
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const events = [{ id: '1', name: 'Test Event' }] as Event[];
      jest.spyOn(eventRepository, 'find').mockResolvedValue(events);

      const result = await service.findAll({ where: {}, order: {} });

      expect(eventRepository.find).toHaveBeenCalledWith({
        where: {},
        order: {},
      });
      expect(result).toEqual(events);
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      const event = { id: '1', name: 'Test Event' } as Event;
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(event);

      const result = await service.findOne('1');

      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(event);
    });

    it('should throw NotFoundException if event not found', async () => {
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(
        'Event with id: 1 not found',
      );
    });
  });

  describe('update', () => {
    it('should update an event and emit EVENT_UPDATED if times changed', async () => {
      const updateEventDto: UpdateEventDto = {
        name: 'Updated Event',
        startTime: new Date(),
        endTime: new Date(),
        repeat: true,
      };
      const event = {
        id: '1',
        name: 'Test Event',
        startTime: new Date('2021-01-01'),
        endTime: new Date('2021-01-02'),
        repeat: false,
      } as Event;
      jest.spyOn(service, 'findOne').mockResolvedValue(event);
      jest
        .spyOn(eventRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      await service.update('1', updateEventDto);

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(eventRepository.update).toHaveBeenCalledWith('1', updateEventDto);
      expect(eventEmitter.emit).toHaveBeenCalledWith(EnumEvent.EVENT_UPDATED, {
        old: event,
        new: { ...event, ...updateEventDto },
      });
    });
  });

  describe('remove', () => {
    it('should delete an event and cancel its scheduled notifications', async () => {
      const event = { id: '1', name: 'Test Event' } as Event;
      jest.spyOn(service, 'findOne').mockResolvedValue(event);
      jest
        .spyOn(eventRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await service.remove('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(eventRepository.delete).toHaveBeenCalledWith('1');
      expect(scheduleService.cancelEvent).toHaveBeenCalledWith(event);
    });
  });
});
