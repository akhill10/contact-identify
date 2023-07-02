import { IsNotEmpty } from 'class-validator';
import { Common } from 'src/common/entities/common.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

export enum ContactLinkPrecedence {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

@Entity()
export class Contact extends Common {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ nullable: false })
  phoneNumber: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  email: string;

  @ManyToOne(() => Contact, (contact) => contact.linkedContacts, {
    onUpdate: 'CASCADE',
  })
  linked?: Contact;

  @OneToMany(() => Contact, (contact) => contact.linked)
  linkedContacts?: Contact[];

  @Column({ enum: ContactLinkPrecedence })
  linkPrecedence: ContactLinkPrecedence;
}
