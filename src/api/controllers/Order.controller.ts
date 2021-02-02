import { Body, JsonController, Post, UploadedFiles } from 'routing-controllers';
import { Container } from 'typedi';

import { uploads } from '../config/multer.config';
import { Order } from '../models/Order.model';
import { OrderService } from '../services/Order.service';

const uploadOpts = uploads.options;

@JsonController('/orders')
export class OrderController {

    @Post()
    public sendOrder(@UploadedFiles('myFiles', { options: uploadOpts } ) files: File[], @Body() order: Order): Promise<Order> {
        const orderServiceInstance = Container.get(OrderService);
        orderServiceInstance.sendOrder(order, files);
        return Promise.resolve(order);
    }

}
