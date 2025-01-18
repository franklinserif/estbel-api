import { Member } from '@members/entities/member.entity';
import {
  BeforeInsert,
  BeforeUpdate,
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
  description: string;

  @Column('text', { nullable: true })
  location: string;

  @ManyToOne(() => Member, (member) => member.groupsLeader)
  leader: Member;

  @ManyToMany(() => Member, (member) => member.groups)
  members: Member[];

  @ManyToOne(() => GroupType, (groupTypes) => groupTypes.groups, {
    eager: true,
  })
  groupTypes: GroupType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.name = this.name?.toLowerCase()?.trim();
    this.location = this.location?.toLowerCase()?.trim();
    this.description = this.description?.toLowerCase()?.trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    if (this.name) {
      this.name = this.name.toLowerCase().trim();
    }

    if (this.location) {
      this.location = this.location.toLowerCase().trim();
    }

    if (this.description) {
      this.description = this.description.toLowerCase().trim();
    }
  }
}
