import fs from 'fs';
import moment from 'moment';
import { Service } from 'typedi';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { BadRequestError } from '../errors/ApiError';
import { AttachmentsInterface } from '../interfaces/attachments.interface';
import { Order } from '../models/order-models/Order.model';
import MailService from './Mail.service';

@Service()
export class OrderService {
  constructor(
    @Logger(__filename) private log: LoggerInterface,
    private mailService: MailService
  ) {}

  public sendOrder(
    order: Order,
    orderFile: File[]
  ): Promise<Order | undefined> {
    this.log.info('Create a new Order => ', order.toString());
    if (!order) {
      throw new BadRequestError('User not registered');
    }
    this.sendMailOrder(order, this.prepareAttachments(orderFile));
    return Promise.resolve(order);
  }

  /**
   * prepare Attachments to send file email
   * @param data File[]
   */
  public prepareAttachments(data: any): AttachmentsInterface {
    return {
      attachments: data.map((element, index) => {
        return {
          filename: element.originalname,
          type: element.mimetype,
          path: element.path,
          content: fs.readFileSync(element.path).toString('base64'),
          cid: `image@add.com`,
        };
      }),
    };
  }

  public sendMailOrder(order: Order, orderImage: any): void {
    moment.locale('pt-br');

    const to = 'diegoceccon1544@gmail.com';
    const from = 'diegoceccon1544@gmail.com';
    const subject = 'diegoceccon1544@gmail.com';
    const attachments = orderImage.attachments;

    const now = moment();

    const message = {
      firstName: order.firstName,
      lastName: order.lastName,
      phoneContact: order.phoneContact,
      cep: order.address.postalCode,
      neighborhood: order.address.neighborhood,
      numberHouse: order.address.numberHouse,
      state: order.address.state,
      city: order.address.city,
      country: 'Brasil',
      complement: order.address.complement,
      detailComplement: order.address.detailComplement,
      typeRequestWork: order.typeRequestWork,
      month: now.format('MMM'),
      year: now.format('YYYY'),
      fullDate: now.format('LLLL'),
    };

    this.mailService.send({ to, from, subject, attachments }, 'order', {
      message,
    });
  }
}
