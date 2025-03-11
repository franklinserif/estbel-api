import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { IQueryParams } from '@common/interfaces/decorators';
import { GroupType } from '@groupTypes/entities/group-types.entity';
import { GroupTypesService } from '@groupTypes/group-types.service';
import { CreateGroupTypesDto } from '@groupTypes/dto/create-group-types.dto';
import { UpdateGroupTypesDto } from '@groupTypes/dto/update-group-types.dto';

describe('GroupTypesService', () => {
  let service: GroupTypesService;
  let repository: Repository<GroupType>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupTypesService,
        {
          provide: getRepositoryToken(GroupType),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GroupTypesService>(GroupTypesService);
    repository = module.get<Repository<GroupType>>(
      getRepositoryToken(GroupType),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a group type', async () => {
      const createDto: CreateGroupTypesDto = {
        name: 'Test',
        description: 'test',
      };
      const expectedGroupType = { id: '1', ...createDto };

      mockRepository.create.mockReturnValue(expectedGroupType);
      mockRepository.save.mockResolvedValue(expectedGroupType);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(expectedGroupType);
      expect(result).toEqual(expectedGroupType);
    });

    it('should propagate repository save errors', async () => {
      const createDto: CreateGroupTypesDto = {
        name: 'Test',
        description: 'test',
      };
      const error = new Error('Save failed');

      mockRepository.create.mockReturnValue(createDto);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return an array of group types', async () => {
      const queryParams: IQueryParams = { where: { name: 'Test' }, order: {} };
      const groupTypes = [{ id: '1', name: 'Test' }];

      mockRepository.find.mockResolvedValue(groupTypes);

      const result = await service.findAll(queryParams);

      expect(repository.find).toHaveBeenCalledWith(queryParams);
      expect(result).toEqual(groupTypes);
    });
  });

  describe('findOne', () => {
    it('should return a group type when found', async () => {
      const groupType = { id: '1', name: 'Test' };

      mockRepository.findOne.mockResolvedValue(groupType);

      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(groupType);
    });

    it('should throw NotFoundException when group type is null', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when group type lacks id', async () => {
      mockRepository.findOne.mockResolvedValue({ name: 'Test' } as GroupType);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateGroupTypesDto = { name: 'Updated' };
    const existingGroupType = { id: '1', name: 'Test' };
    const updatedGroupType = { ...existingGroupType, ...updateDto };

    it('should update and return the group type', async () => {
      mockRepository.findOne
        .mockResolvedValueOnce(existingGroupType) // First call in update's findOne check
        .mockResolvedValueOnce(updatedGroupType); // Second call to return updated entity
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update('1', updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.update).toHaveBeenCalledWith('1', updateDto);
      expect(repository.findOne).toHaveBeenCalledTimes(2);
      expect(result).toEqual(updatedGroupType);
    });

    it('should throw NotFoundException if group type does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete the group type', async () => {
      const deleteResult = { affected: 1 };
      mockRepository.findOne.mockResolvedValue({ id: '1' });
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual(deleteResult);
    });

    it('should throw NotFoundException if group type does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
