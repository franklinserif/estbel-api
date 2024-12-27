import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccessDto } from './dto/createAccesses.dto';
import { UpdateAccessDto } from './dto/updateAccesses.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Accesses } from './entities/accesses.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccessesService {
  constructor(
    @InjectRepository(Accesses)
    private readonly AccessesRepository: Repository<Accesses>,
  ) {}

  async create(createUserModuleAccessDto: CreateAccessDto) {
    const UMA = this.AccessesRepository.create(createUserModuleAccessDto);

    return await this.AccessesRepository.save(UMA);
  }

  async findAll() {
    const UAMS = await this.AccessesRepository.find();

    return UAMS;
  }

  async findOne(id: string) {
    const UAM = await this.AccessesRepository.findOne({ where: { id } });

    if (!UAM?.id) {
      throw new NotFoundException(`UAM with id: ${id} not found`);
    }

    return UAM;
  }

  async update(id: string, updateUserModuleAccessDto: UpdateAccessDto) {
    await this.findOne(id);

    const updatedUAM = await this.AccessesRepository.update(
      id,
      updateUserModuleAccessDto,
    );

    return updatedUAM;
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.AccessesRepository.delete(id);
  }
}
