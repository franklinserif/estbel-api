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
import { Group } from '@groups/entities/group.entity';

@Entity('group_types')
export class GroupType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @OneToMany(() => Group, (groups) => groups.groupType)
  groups: Group[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  checkBeforeInsert() {
    this.name = this.name.toLowerCase().trim();
    this.description = this.description.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkBeforeUpdate() {
    if (this.name) {
      this.name = this.name.toLowerCase().trim();
    }

    if (this.description) {
      this.description = this.description.toLowerCase().trim();
    }
  }
}
