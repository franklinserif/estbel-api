import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Accesses } from '@accesses/entities/accesses.entity';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text')
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Accesses, (accesses) => accesses.module)
  accesses: Accesses[];

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.name = this.name.toLowerCase().trim();
    this.description = this.description.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    if (this.name) {
      this.name = this.name.toLowerCase().trim();
    }

    if (this.description) {
      this.description = this.description.toLowerCase().trim();
    }
  }
}
