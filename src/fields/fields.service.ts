import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from './entities/field.entity';
import { IQueryParams } from '@common/interfaces/decorators';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  async create(createFieldDto: CreateFieldDto) {
    const field = this.fieldRepository.create(createFieldDto);

    return await this.fieldRepository.save(field);
  }

  async findAll(queryParams: IQueryParams) {
    const fields = await this.fieldRepository.find(queryParams);

    return fields;
  }

  async findOne(id: string) {
    const field = await this.fieldRepository.findOne({ where: { id } });

    if (!field?.id) {
      throw new NotFoundException(`field with id: ${id} not found`);
    }

    return field;
  }

  async update(id: string, updateFieldDto: UpdateFieldDto) {
    await this.findOne(id);

    return await this.fieldRepository.update(id, updateFieldDto);
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.fieldRepository.delete(id);
  }
}
