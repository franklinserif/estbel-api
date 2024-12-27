import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserModuleAccess } from '@user-module-access/entities/user-module-access.entity';
import { ModulesService } from '@modules/modules.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserModuleAccess)
    private readonly UAMRepository: Repository<UserModuleAccess>,

    private readonly moduleService: ModulesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    const modules = await this.moduleService.findAll();

    const accesses = modules.map((module) => ({
      canDelete: false,
      canEdit: false,
      canRead: false,
      module,
      user,
    }));

    console.log('accesses: ', accesses);
    console.log('user: ', user);

    // Guarda el usuario primero
    const createdUser = await this.userRepository.save(user);

    // Guarda los accesos en la base de datos
    await this.UAMRepository.save(accesses);

    return createdUser;
  }

  async findAll() {
    const users = await this.userRepository.find();

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
