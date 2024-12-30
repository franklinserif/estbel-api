import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Accesses } from '@accesses/entities/accesses.entity';
import { ModulesService } from '@modules/modules.service';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Accesses)
    private readonly UAMRepository: Repository<Accesses>,

    private readonly moduleService: ModulesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    const modules = await this.moduleService.findAll({ where: {}, order: {} });

    const accesses = modules.map((module) => ({
      canDelete: false,
      canEdit: false,
      canRead: false,
      canPrint: false,
      module,
      user,
    }));

    const createdUser = await this.userRepository.save(user);

    await this.UAMRepository.save(accesses);

    return createdUser;
  }

  async findAll(queryParams: IQueryParams) {
    const users = await this.userRepository.find(queryParams);

    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user?.id) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const updatedUser = await this.userRepository.update(id, updateUserDto);

    return updatedUser;
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.userRepository.delete(id);
  }
}
