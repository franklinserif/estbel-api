import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Accesses } from '@accesses/entities/accesses.entity';
import { Member } from '@members/entities/member.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Member, { eager: true, nullable: true })
  @JoinColumn()
  member: Member;

  @OneToMany(() => Accesses, (accesses) => accesses.admin, {
    eager: true,
    cascade: true,
  })
  accesses: Accesses[];
}
