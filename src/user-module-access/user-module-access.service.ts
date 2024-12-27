import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserModuleAccessDto } from './dto/create-user-module-access.dto';
import { UpdateUserModuleAccessDto } from './dto/update-user-module-access.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModuleAccess } from './entities/user-module-access.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserModuleAccessService {
  constructor(
    @InjectRepository(UserModuleAccess)
    private readonly UMARepository: Repository<UserModuleAccess>,
  ) {}

  async create(createUserModuleAccessDto: CreateUserModuleAccessDto) {
    const UMA = this.UMARepository.create(createUserModuleAccessDto);

    return await this.UMARepository.save(UMA);
  }

  async findAll() {
    const UAMS = await this.UMARepository.find();

    return UAMS;
  }

  async findOne(id: string) {
    const UAM = await this.UMARepository.findOne({ where: { id } });

    if (!UAM?.id) {
      throw new NotFoundException(`UAM with id: ${id} not found`);
    }

    return UAM;
  }

  async update(
    id: string,
    updateUserModuleAccessDto: UpdateUserModuleAccessDto,
  ) {
    await this.findOne(id);

    const updatedUAM = await this.UMARepository.update(
      id,
      updateUserModuleAccessDto,
    );

    return updatedUAM;
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.UMARepository.delete(id);
  }
}
