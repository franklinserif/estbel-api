import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Accesses } from '@accesses/entities/accesses.entity';

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

  @OneToMany(() => Accesses, (accesses) => accesses.module)
  accesses: Accesses[];
}
