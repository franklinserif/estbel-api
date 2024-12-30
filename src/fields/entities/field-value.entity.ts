import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from '@members/entities/member.entity';
import { Field } from './field.entity';

@Entity('fields_value')
export class FieldValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fieldValue: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.fields)
  member: Member;

  @ManyToOne(() => Field, (field) => field.fieldsValue, { onDelete: 'CASCADE' })
  field: Field;
}
