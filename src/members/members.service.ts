import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { In, Repository } from 'typeorm';
import { IQueryParams } from '@common/interfaces/decorators';
import { Field } from '@fields/entities/field.entity';
import { FieldValue } from '@fields/entities/field-value.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,

    @InjectRepository(FieldValue)
    private readonly fieldValueRepository: Repository<FieldValue>,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const { fields, ci } = createMemberDto;

    const fieldNames = fields.map((fieldValue) => fieldValue.field.fieldName);

    const existingFields = await this.fieldRepository.find({
      where: {
        fieldName: In(fieldNames),
      },
    });

    if (existingFields.length !== fieldNames.length) {
      const missingFields = fieldNames.filter(
        (fieldName) =>
          !existingFields.some(
            (existingField) => existingField.fieldName === fieldName,
          ),
      );
      throw new BadRequestException(
        `The following fields are not registered: ${missingFields.join(', ')}`,
      );
    }

    const member = this.memberRepository.create({
      ci,
      fields: fields.map((fieldValue) => ({
        fieldValue: fieldValue.fieldValue,
        field: existingFields.find(
          (existingField) =>
            existingField.fieldName === fieldValue.field.fieldName,
        ),
      })),
    });

    return await this.memberRepository.save(member);
  }

  async findAll(queryParams: IQueryParams) {
    return await this.memberRepository.find(queryParams);
  }

  async findOne(id: string) {
    const member = await this.memberRepository.findOne({ where: { id } });

    if (!member?.id) {
      throw new NotFoundException(`member with id: ${id} not found`);
    }

    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const member = await this.findOne(id);

    if (updateMemberDto.fields) {
      for (const fieldData of updateMemberDto.fields) {
        const fieldValue = member.fields.find((fv) => fv.id === fieldData.id);

        if (fieldValue) {
          fieldValue.fieldValue = fieldData.fieldValue || fieldValue.fieldValue;
          await this.fieldValueRepository.save(fieldValue);
        }
      }
    }

    await this.memberRepository.save(member);
    return member;
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.memberRepository.delete(id);
  }
}
