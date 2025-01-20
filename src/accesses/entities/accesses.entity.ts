import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admin } from '@admins/entities/admin.entity';
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

  @ManyToOne(() => Admin, (admin) => admin.accesses, { onDelete: 'CASCADE' })
  admin: Admin;

  @ManyToOne(() => Module, (module) => module.accesses)
  module: Module;
}
