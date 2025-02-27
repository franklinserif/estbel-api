import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessesService } from '@accesses/accesses.service';
import { Accesses } from '@accesses/entities/accesses.entity';
import { CreateAccessDto } from '@accesses/dto/createAccesses.dto';
import { UpdateAccessDto } from '@accesses/dto/updateAccesses.dto';
import { NotFoundException } from '@nestjs/common';

describe('AccessesService', () => {
  let service: AccessesService;
  let repository: Repository<Accesses>;

  const mockAccess = {
    id: '1',
    canRead: true,
    canEdit: false,
    canDelete: false,
    canPrint: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateDto: CreateAccessDto = {
    canRead: true,
    canEdit: false,
    canDelete: false,
    canPrint: true,
  };

  const mockUpdateDto: UpdateAccessDto = {
    canRead: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessesService,
        {
          provide: getRepositoryToken(Accesses),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((access) =>
                Promise.resolve({ id: '1', ...access }),
              ),
            find: jest.fn().mockResolvedValue([mockAccess]),
            findOne: jest.fn().mockResolvedValue(mockAccess),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<AccessesService>(AccessesService);
    repository = module.get<Repository<Accesses>>(getRepositoryToken(Accesses));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new access record', async () => {
      const result = await service.create(mockCreateDto);

      expect(repository.create).toHaveBeenCalledWith(mockCreateDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining(mockCreateDto));
      expect(result.id).toEqual('1');
    });
  });

  describe('findAll', () => {
    it('should return an array of accesses', async () => {
      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockAccess]);
    });
  });

  describe('findOne', () => {
    it('should return a single access record', async () => {
      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockAccess);
    });

    it('should throw NotFoundException if access not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an access record', async () => {
      const updatedAccess = { ...mockAccess, ...mockUpdateDto };
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(mockAccess as Accesses)
        .mockResolvedValueOnce(updatedAccess as Accesses);

      const result = await service.update('1', mockUpdateDto);

      expect(repository.update).toHaveBeenCalledWith('1', mockUpdateDto);
      expect(result).toEqual(updatedAccess);
    });

    it('should throw NotFoundException if access to update does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update('invalid-id', mockUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete an access record', async () => {
      const result = await service.remove('1');

      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if access to delete does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
