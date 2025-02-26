import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { ScheduleService } from './schedule.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JobInfo } from '@common/interfaces/schedule';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IQueryParams } from '@common/interfaces/decorators';

describe('EventsService', () => {
  let service: EventsService;

  const mockEventRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockScheduleService = {
    addCronJobs: jest.fn(),
    cancelEvent: jest.fn(),
  };

  const mockEventEmitter = {
    emitAsync: jest.fn(),
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
        {
          provide: ScheduleService,
          useValue: mockScheduleService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should load existing events and schedule cron jobs', async () => {
      const mockEvents = [{ id: '1', name: 'Event 1' }];
      mockEventRepository.find.mockResolvedValue(mockEvents);

      await service.onModuleInit();

      expect(mockEventRepository.find).toHaveBeenCalled();
      expect(mockScheduleService.addCronJobs).toHaveBeenCalledWith(mockEvents);
    });

    it('should log a message if no events are found', async () => {
      mockEventRepository.find.mockResolvedValue([]);

      await service.onModuleInit();

      expect(mockEventRepository.find).toHaveBeenCalled();
      expect(mockScheduleService.addCronJobs).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new event and schedule its notifications', async () => {
      const createEventDto: CreateEventDto = {
        id: uuid(),
        name: 'New Event',
        startTime: new Date(),
        endTime: new Date(),
        repeat: true,
        description: 'lorem ipsum',
        address: 'lorem ipsum',
        location: 'lorem ipsum',
      };
      const mockJobInfo: JobInfo = {
        start: { cronExpression: '0 0 * * *', jobKey: 'lorem ipsum 1' },
        end: { cronExpression: '0 1 * * *', jobKey: 'lorem ipsum 2' },
      };

      mockEventRepository.create.mockReturnValue(createEventDto);
      mockEventRepository.save.mockResolvedValue(createEventDto);
      mockEventEmitter.emitAsync.mockResolvedValue([mockJobInfo]);

      const result = await service.create(createEventDto);

      expect(mockEventRepository.create).toHaveBeenCalledWith(createEventDto);
      expect(mockEventEmitter.emitAsync).toHaveBeenCalledWith(
        'event.created',
        createEventDto,
      );
      expect(mockEventRepository.save).toHaveBeenCalledWith({
        ...createEventDto,
        startCronExpression: mockJobInfo.start.cronExpression,
        endCronExpression: mockJobInfo.end.cronExpression,
      });
      expect(result).toEqual(createEventDto);
    });
  });

  describe('findAll', () => {
    it('should return a list of events', async () => {
      const mockEvents = [{ id: '1', name: 'Event 1' }];
      const queryParams: IQueryParams = { where: {}, order: {} };

      mockEventRepository.find.mockResolvedValue(mockEvents);

      const result = await service.findAll(queryParams);

      expect(mockEventRepository.find).toHaveBeenCalledWith(queryParams);
      expect(result).toEqual(mockEvents);
    });
  });

  describe('findOne', () => {
    it('should return a single event by ID', async () => {
      const mockEvent = { id: '1', name: 'Event 1' };

      mockEventRepository.findOne.mockResolvedValue(mockEvent);

      const result = await service.findOne('1');

      expect(mockEventRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException if event is not found', async () => {
      mockEventRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an existing event and reschedule notifications if necessary', async () => {
      const updateEventDto: UpdateEventDto = {
        name: 'Updated Event',
        startTime: new Date(),
        endTime: new Date(),
        repeat: true,
      };
      const mockEvent = { id: '1', name: 'Event 1', ...updateEventDto };
      const mockUpdateResult = { affected: 1 };

      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockEventRepository.update.mockResolvedValue(mockUpdateResult);

      const result = await service.update('1', updateEventDto);

      expect(mockEventRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockEventRepository.update).toHaveBeenCalledWith(
        '1',
        updateEventDto,
      );

      expect(result).toEqual(mockUpdateResult);
    });
  });

  describe('remove', () => {
    it('should delete an event and cancel its scheduled notifications', async () => {
      const mockEvent = { id: '1', name: 'Event 1' };
      const mockDeleteResult = { affected: 1 };

      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockEventRepository.delete.mockResolvedValue(mockDeleteResult);

      const result = await service.remove('1');

      expect(mockEventRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockEventRepository.delete).toHaveBeenCalledWith('1');
      expect(mockScheduleService.cancelEvent).toHaveBeenCalledWith(mockEvent);
      expect(result).toEqual(mockDeleteResult);
    });
  });
});
