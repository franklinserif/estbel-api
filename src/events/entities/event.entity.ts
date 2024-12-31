import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attendance } from './attendance.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  address: string;

  @Column('text')
  location: string;

  @Column('bool')
  permanent: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  startTime: Date;

  @CreateDateColumn({ type: 'timestamp' })
  endTime: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Attendance, (attendances) => attendances.event)
  attendances: Attendance[];

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.name = this.name.toLowerCase().trim();
    this.address = this.address.toLowerCase().trim();
    this.location = this.location.toLowerCase().trim();
  }
}
