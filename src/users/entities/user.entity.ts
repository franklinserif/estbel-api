import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserModuleAccess } from '@modules/entities/user-module-access.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  firstName: string;

  @Column('text', {})
  lastName: string;

  @Column('text')
  email: string;

  @Column('text')
  phone: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @OneToMany(
    () => UserModuleAccess,
    (userModuleAccess) => userModuleAccess.user,
  )
  userModuleAccess: UserModuleAccess[];
}
