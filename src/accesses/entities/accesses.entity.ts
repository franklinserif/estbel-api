import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';
import { Module } from '@modules/entities/module.entity';

@Entity('access')
export class Accesses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('bool', {
    default: false,
  })
  canRead: boolean;

  @Column('bool', {
    default: false,
  })
  canEdit: boolean;

  @Column('bool', {
    default: false,
  })
  canDelete: boolean;

  @Column('bool', {
    default: false,
  })
  canPrint: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.accesses)
  user: User;

  @ManyToOne(() => Module, (module) => module.accesses)
  module: Module;
}
