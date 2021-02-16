import { IsNotEmpty } from 'class-validator';
import {
    Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { Address } from '../address-models/Address.model';
import { User } from '../user-models/User.model';

@Entity()
export class Establishment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsNotEmpty({ message: 'Razão social é obrigatório' })
  public socialReason: string;

  @Column()
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  public document: string;

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

  @Column('int')
  public userId!: number;

  @ManyToOne(() => User, (user) => user.establishment)
  public user: User;

  @Column('int')
  public addressId!: number;

  @ManyToOne(() => Address, (address) => address.establishment)
  public address: Address;

  constructor(id?: number) {
    this.id = id;
  }
}
