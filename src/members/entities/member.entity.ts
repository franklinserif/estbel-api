import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
  BeforeInsert,
} from 'typeorm';
import { FieldValue } from '@fields/entities/field-value.entity';
import { Attendance } from 'src/events/entities/attendance.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: true,
  })
  ci: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => FieldValue, (fieldsValue) => fieldsValue.member, {
    eager: true,
    cascade: true,
  })
  fields: FieldValue[];

  @OneToMany(() => Attendance, (attendaces) => attendaces.Member)
  attendances: Attendance[];
}
