import {
    Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { Address } from './Address.model';
import { State } from './State.model';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

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

  @ManyToOne(() => State, (state) => state.citys)
  public state: State;

  @Column('int')
  public stateId!: number;

  @OneToMany(() => Address, (address: Address) => address.city)
  public citys: Address[];

  constructor(id?: number) {
    this.id = id;
  }
}
