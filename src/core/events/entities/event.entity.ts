import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attendance } from '@attendances/entities/attendance.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  address: string;

  @Column('text')
  location: string;

  @Column('bool', { default: false })
  repeat: boolean;

  @Column('text', { nullable: true })
  startCronExpression: string;

  @Column('text', { nullable: true })
  endCronExpression: string;

  @Column('bool', { default: false })
  isActive: boolean;

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

  @BeforeUpdate()
  checkBeforeUpdate() {
    if (this.name) {
      this.name = this.name.toLowerCase().trim();
    }

    if (this.address) {
      this.address = this.address.toLowerCase().trim();
    }

    if (this.location) {
      this.location = this.location.toLowerCase().trim();
    }
  }
}
