import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserModuleAccess } from './user-module-access.entity';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text', {})
  description: string;

  @OneToMany(
    () => UserModuleAccess,
    (userModuleAccess) => userModuleAccess.module,
  )
  userModuleAccess: UserModuleAccess[];
}
