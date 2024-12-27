import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Accesses } from '@accesses/entities/accesses.entity';

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

  @OneToMany(() => Accesses, (accesses) => accesses.user, {
    eager: true,
    cascade: true,
  })
  accesses: Accesses[];
}
