import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Container } from 'typedi';

import MailService from '../api/services/Mail.service';
import { OrderService } from '../api/services/Order.service';

export const dependencyInjectorLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        Container.set('orderService', OrderService);
        Container.set('mailService', MailService);
    }
};
