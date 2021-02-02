import { IsNotEmpty } from 'class-validator';

import { Address } from './Address.model';
import { Phone } from './Phone.model';

export class Order {

    public id: string;

    @IsNotEmpty()
    public firstName: string;

    @IsNotEmpty()
    public lastName: string;

    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    public phoneContact: [Phone];

    @IsNotEmpty()
    public typeRequestWork: string; // Defeito ou revisão

    @IsNotEmpty()
    public address: Address;

}
