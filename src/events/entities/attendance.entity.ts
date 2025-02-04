import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from '@events/entities/event.entity';
import { Member } from '@members/entities/member.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('bool', { default: false, nullable: true })
  attended: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Event, (event) => event.attendances, { eager: true })
  event: Event;

  @ManyToOne(() => Member, (members) => members.attendances)
  Member: Member;
}
