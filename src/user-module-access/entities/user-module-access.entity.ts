import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { Module } from '@modules/entities/module.entity';

@Entity('user_module_access')
export class UserModuleAccess {
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

  @ManyToOne(() => User, (user) => user.userModuleAccess)
  user: User;

  @ManyToOne(() => Module, (module) => module.userModuleAccess)
  module: Module;
}
