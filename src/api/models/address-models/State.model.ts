import {
    Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { City } from './City.model';
import { Country } from './Country.model';

@Entity()
export class State {
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

  @OneToMany(() => City, (city: City) => city.state)
  public citys: City[];

  @Column('int')
  public countryId!: number;

  @ManyToOne(() => Country, (country) => country.states)
  public country: Country;

  constructor(name?: string, code?: string, countryId?: number) {
    this.name = name;
    this.code = code;
    this.countryId = countryId;
  }
}
