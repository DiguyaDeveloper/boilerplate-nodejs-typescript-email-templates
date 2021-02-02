import { IsNotEmpty } from 'class-validator';

export class Phone {

    public id: string;

    @IsNotEmpty()
    public prefix: string;

    @IsNotEmpty()
    public ddd: string;

    @IsNotEmpty()
    public number: string;

    @IsNotEmpty()
    public typePhone: string;

}
