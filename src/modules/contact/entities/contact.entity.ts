import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

export enum ContactLinkPrecedence {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

@Entity()
@Index(['email'])
@Index(['phoneNumber'])
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ nullable: true })
  phoneNumber?: string;

  @IsNotEmpty()
  @Column({ nullable: true })
  email?: string;

  @ManyToOne(() => Contact, (contact) => contact.linkedContacts, {
    onUpdate: 'CASCADE',
  })
  linked?: Contact;

  @OneToMany(() => Contact, (contact) => contact.linked)
  linkedContacts?: Contact[];

  @Column({ enum: ContactLinkPrecedence })
  linkPrecedence: ContactLinkPrecedence;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn({ select: false })
  deletedAt?: Date;
}
