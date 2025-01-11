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
  ManyToOne,
} from 'typeorm';
import { Attendance } from 'src/events/entities/attendance.entity';
import { Gender } from '@members/enum/options';
import { Group } from 'src/groups/entities/group.entity';
import { MemberStatus } from '@memberStatus/entities/member-status.entity';
import { User } from '@users/entities/user.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: true,
  })
  ci: string;

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
  parish: string;

  // sector for spanish
  @Column('text', { nullable: true })
  zone: string;

  @Column('text', { nullable: true })
  address: string;

  @Column('text', { nullable: true })
  howTheyArrived: string;

  @Column('boolean')
  isBaptized: boolean;

  @Column({ type: 'timestamp' })
  baptizedAt: Date;

  @Column('text', { nullable: true })
  baptizedChurch: string;

  @Column({ type: 'boolean', default: false })
  civilStatus: boolean;

  @Column({ type: 'timestamp', nullable: true })
  weddingAt: Date;

  @Column({ type: 'timestamp' })
  firstVisitAt: Date;

  @ManyToMany(() => Member, (member) => member.children, { cascade: true })
  @JoinTable({
    name: 'member_parents',
    joinColumn: { name: 'child_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'parent_id', referencedColumnName: 'id' },
  })
  parents: Member[];

  @ManyToMany(() => Member, (member) => member.parents)
  children: Member[];

  @OneToOne(() => Member, (member) => member.spouse)
  @JoinColumn({ name: 'spouse_id' })
  spouse: Member;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @OneToMany(() => Group, (groups) => groups.leader)
  groupsLeader: Group[];

  @ManyToMany(() => Group, (groups) => groups.members)
  @JoinTable()
  groups: Group[];

  @OneToMany(() => MemberStatus, (membersStatus) => membersStatus.member)
  membersStatus: MemberStatus[];

  @OneToMany(() => Attendance, (attendaces) => attendaces.Member)
  attendances: Attendance[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.firstName = this.firstName.toLowerCase().trim();
    this.lastName = this.lastName.toLowerCase().trim();
    this.email = this.email.toLowerCase().trim();
    this.phone = this.phone.toLowerCase().trim();
    this.municipality = this.municipality.toLowerCase().trim();
    this.parish = this.parish.toLowerCase().trim();
    this.zone = this.zone.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.firstName = this.firstName.toLowerCase().trim();
    this.lastName = this.lastName.toLowerCase().trim();
    this.email = this.email.toLowerCase().trim();
    this.phone = this.phone.toLowerCase().trim();
    this.municipality = this.municipality.toLowerCase().trim();
    this.parish = this.parish.toLowerCase().trim();
    this.zone = this.zone.toLowerCase().trim();
  }
}
