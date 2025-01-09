import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { Attendance } from 'src/events/entities/attendance.entity';
import { Gender } from '@members/enum/options';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: true,
  })
  ci: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @Column('text', { nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  birthdate: string;

  @Column('text', { nullable: true, unique: true })
  email: string;

  @Column('text', { nullable: true })
  municipality: string;

  @Column('text', { nullable: true })
  parish: string;

  // sector for spanish
  @Column('text', { nullable: true })
  zone: string;

  @Column('text', { nullable: true })
  address: string;

  @Column('text', { nullable: true })
  howTheyArrived: string;

  @Column('boolean')
  isBaptized: boolean;

  @Column({ type: 'timestamp' })
  baptizedAt: Date;

  @Column('text', { nullable: true })
  baptizedChurch: string;

  @Column({ type: 'boolean', default: false })
  civilStatus: boolean;

  @Column({ type: 'timestamp', nullable: true })
  weddingAt: Date;

  @Column({ type: 'timestamp' })
  firstVisitAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Attendance, (attendaces) => attendaces.Member)
  attendances: Attendance[];
}
