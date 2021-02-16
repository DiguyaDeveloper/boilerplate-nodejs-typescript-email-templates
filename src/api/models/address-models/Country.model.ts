import {
    Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { State } from './State.model';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public code: string;

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

  @OneToMany(() => State, (state: State) => state.country)
  public states: State[];

  constructor(name?: string, code?: string) {
    this.name = name;
    this.code = code;
  }
}
