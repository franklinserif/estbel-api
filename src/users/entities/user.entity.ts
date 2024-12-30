import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Accesses } from '@accesses/entities/accesses.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  firstName: string;

  @Column('text', {})
  lastName: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  phone: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Accesses, (accesses) => accesses.user, {
    eager: true,
    cascade: true,
  })
  accesses: Accesses[];

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.firstName = this.firstName.toLowerCase().trim();
    this.lastName = this.lastName.toLowerCase().trim();
    this.email = this.email.toLowerCase().trim();
    this.phone = this.phone.toLowerCase().trim();
  }
}
