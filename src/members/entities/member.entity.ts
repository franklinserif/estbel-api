import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  OneToOne,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import { Attendance } from 'src/events/entities/attendance.entity';
import { Gender } from '@members/enum/options';
import { CivilStatus } from '@members/enum/options';
import { Group } from 'src/groups/entities/group.entity';
import { MemberStatus } from '@memberStatus/entities/member-status.entity';
import { User } from '@users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @Column('text', { nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  birthdate: string;

  @Column('text', { nullable: true, unique: true })
  email: string;

  @Column('text', { nullable: true })
  municipality: string;

  @Column('text', { nullable: true })
  location: string; // municipio

  @Column('text', { nullable: true })
  zone: string; // sector

  @Column('text', { nullable: true })
  address: string;

  @Column('text', { nullable: true })
  howTheyArrived: string;

  @Column({ type: 'timestamp', nullable: true })
  baptizedAt: Date;

  @Column('text', { nullable: true })
  baptizedChurch: string;

  @Column({
    type: 'enum',
    enum: CivilStatus,
    default: CivilStatus.SINGLE,
  })
  civilStatus: CivilStatus;

  @Column({ type: 'timestamp', nullable: true })
  weddingAt: Date;

  @Column({ type: 'timestamp' })
  firstVisitAt: Date;

  @ManyToMany(() => Member, (member) => member.children, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({
    name: 'member_parents',
    joinColumn: { name: 'child_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'parent_id', referencedColumnName: 'id' },
  })
  parents: Member[];

  @ManyToMany(() => Member, (member) => member.parents)
  children: Member[];

  @OneToOne(() => Member, (member) => member.spouse, { nullable: true })
  @JoinColumn({ name: 'spouse_id' })
  spouse: Member;

  @OneToOne(() => User, { eager: true, nullable: true })
  @JoinColumn()
  user: User;

  @OneToMany(() => Group, (groups) => groups.leader, { nullable: true })
  groupsLeader: Group[];

  @ManyToMany(() => Group, (groups) => groups.members, { nullable: true })
  @JoinTable()
  groups: Group[];

  @OneToMany(() => MemberStatus, (membersStatus) => membersStatus.member)
  membersStatus: MemberStatus[];

  @OneToMany(() => Attendance, (attendaces) => attendaces.Member, {
    nullable: true,
  })
  attendances: Attendance[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  checkFieldBeforeInsert() {
    if (!this?.id) {
      this.id = uuidv4();
    } else {
      this.id = this.id.toLowerCase().trim();
    }

    this.firstName = this.firstName.toLowerCase().trim();
    this.lastName = this.lastName.toLowerCase().trim();
    this.email = this.email.toLowerCase().trim();
    this.phone = this.phone.toLowerCase().trim();
    this.municipality = this.municipality.toLowerCase().trim();
    this.location = this.location.toLowerCase().trim();
    this.zone = this.zone.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    if (this.id) {
      this.id = this.id.toLowerCase().trim();
    }

    if (this.firstName) {
      this.firstName = this.firstName.toLowerCase().trim();
    }

    if (this.lastName) {
      this.lastName = this.lastName.toLowerCase().trim();
    }

    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }

    if (this.phone) {
      this.phone = this.phone.toLowerCase().trim();
    }

    if (this.municipality) {
      this.municipality = this.municipality.toLowerCase().trim();
    }

    if (this.location) {
      this.location = this.location.toLowerCase().trim();
    }

    if (this.zone) {
      this.zone = this.zone.toLowerCase().trim();
    }
  }
}
