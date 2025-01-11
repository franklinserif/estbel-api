import { Member } from '@members/entities/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupType } from '@groupTypes/entities/group-types.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  location: string;

  @ManyToOne(() => Member, (member) => member.groupsLeader, { eager: true })
  leader: Member;

  @ManyToMany(() => Member, (member) => member.groups, { eager: true })
  members: Member[];

  @ManyToOne(() => GroupType, (groupTypes) => groupTypes.groups)
  groupTypes: GroupType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
