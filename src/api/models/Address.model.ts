import { IsNotEmpty } from 'class-validator';

export class Address {

    public id: string;

    @IsNotEmpty()
    public cep: string;

    @IsNotEmpty()
    public neighborhood: string;

    @IsNotEmpty()
    public numberHouse: string;

    @IsNotEmpty()
    public state: string;

    @IsNotEmpty()
    public city: string;

    @IsNotEmpty()
    public complement: string;

    public detailComplement: string;

}
