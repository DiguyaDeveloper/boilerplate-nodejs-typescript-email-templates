import * as bcrypt from 'bcrypt';
import { IsEmail, IsNotEmpty } from 'class-validator';
import {
    BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { Address } from '../address-models/Address.model';
import { Establishment } from '../establishment-models/Establishment.model';
import { Role } from './Role.model';

export enum UserStatus {
  Inactive = 'INACTIVE',
  Active = 'ACTIVE',
  Block = 'BLOCK',
  New = 'NEW',
}

@Entity()
export class User {
  public static hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password.toString(), 10, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @IsNotEmpty({ message: 'Name is required' })
  @Column()
  public name: string;

  @Column()
  @IsNotEmpty({ message: 'LastName is required' })
      public lastName: string;

  @Column()
  @IsNotEmpty({ message: 'CPF is required' })
  public document: string;

  @Column('varchar', { length: 255, name: 'email' })
  @IsEmail(
    { allow_display_name: true },
    {
      message: 'The email is not valid',
    }
  )
  @IsNotEmpty({
    message: 'Email is required',
  })
  public email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Column('varchar', { length: 255, name: 'password' })
  public password: string;

  @Column('tinyint', { default: 0 })
  @IsNotEmpty({ message: 'Term and conditions is required' })
  public termsAndConditions?: number;

  @Column('int')
  public roleId!: number;

  @ManyToOne(() => Role, (role) => role.users)
  public role: Role;

  @Column('int', { nullable: true })
  public addressId!: number;

  @ManyToOne(() => Address, (address) => address.users)
  public address: Address;

  @Column('varchar', { default: UserStatus.New })
  @IsNotEmpty({
    message: 'The user status is required',
  })
  public status: UserStatus;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createDate',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createDate: string;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updateDate',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public updateDate: string;

  @Column({ nullable: true })
  public token: string;

  @Column('int', { default: 0 })
  public confirmation_code: number;

  @OneToMany(
    () => Establishment,
    (establishment: Establishment) => establishment.address
  )
  public establishment: Establishment[];

  constructor(
    name: string,
    lastName: string,
    email: string,
    password: string,
    document: string,
    status: UserStatus,
    termsAndConditions: number,
    roleId: number
  ) {
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.document = document;
    this.status = status;
    this.termsAndConditions = termsAndConditions;
    this.roleId = roleId;
  }

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.password = await User.hashPassword(this.password);
  }

  public checkIfUnEncryptedPasswordIsValid(
    unEncryptedPassword: string
  ): boolean {
    return bcrypt.compareSync(unEncryptedPassword, this.password);
  }
}
