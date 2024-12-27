import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserModuleAccess } from '@user-module-access/entities/user-module-access.entity';

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
    { eager: true },
  )
  userModuleAccess: UserModuleAccess[];
}
