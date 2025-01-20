import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Accesses } from '@accesses/entities/accesses.entity';
import { ModulesService } from '@modules/modules.service';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,

    @InjectRepository(Accesses)
    private readonly UAMRepository: Repository<Accesses>,

    private readonly moduleService: ModulesService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const admin = this.adminsRepository.create(createAdminDto);

    const modules = await this.moduleService.findAll({ where: {}, order: {} });

    const accesses = modules.map((module) => ({
      canDelete: false,
      canEdit: false,
      canRead: false,
      canPrint: false,
      module,
      admin,
    }));

    const createdAdmin = await this.adminsRepository.save(admin);

    await this.UAMRepository.save(accesses);

    return createdAdmin;
  }

  async findAll(queryParams: IQueryParams) {
    const users = await this.adminsRepository.find(queryParams);

    return users;
  }

  async findOne(id: string) {
    const admin = await this.adminsRepository.findOne({ where: { id } });

    if (!admin?.id) {
      throw new NotFoundException(`admin with id: ${id} not found`);
    }

    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    await this.findOne(id);

    return await this.adminsRepository.update(id, updateAdminDto);
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.adminsRepository.delete(id);
  }
}
