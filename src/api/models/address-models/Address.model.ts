import { IsNotEmpty } from 'class-validator';
import {
    Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { Establishment } from '../establishment-models/Establishment.model';
import { User } from '../user-models/User.model';
import { City } from './City.model';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  @IsNotEmpty({ message: 'Código postal é obrigatório' })
  public postalCode: string;

  @IsNotEmpty({ message: 'logradouro é obrigatório' })
  public neighborhood: string;

  @IsNotEmpty()
  public numberHouse: string;

  @IsNotEmpty()
  public state: string;

  @Column('int')
  public cityId!: number;

  @ManyToOne(() => City, (city) => city.citys)
  public city: City;

  @OneToMany(() => User, (user: User) => user.address)
  public users: User[];

  @OneToMany(
    () => Establishment,
    (establishment: Establishment) => establishment.address
  )
  public establishment: Establishment[];

  @IsNotEmpty()
  public complement: string;

  public detailComplement: string;

  @Column()
  @IsNotEmpty({ message: 'Latitude é obrigatório' })
  public latitude: number;

  @Column('int')
  @IsNotEmpty({ message: 'Longitude é obrigatório' })
  public longitude: number;

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
}
