import Email from 'email-templates';
import { createTransport } from 'nodemailer';
import * as path from 'path';
import { Service } from 'typedi';

import { env } from '../../env';

const config = {
  transporter: {
    host: env.app.sendMail.host,
    port: Number(env.app.sendMail.port) || 465,
    auth: {
      user: env.app.sendMail.email,
      pass: env.app.sendMail.password,
    },
  },
  template: {
    views: {
      root: path.resolve('src/views/'),
      options: {
        extension: 'hbs',
      },
    },
    message: undefined,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: path.resolve('assets'),
        images: true,
      },
    },
  },
};

@Service()
class MailService {
  public transporter = createTransport(config.transporter);
  public template = new Email(config.template);

  public send = async (
    options: {
      to: string;
      from: string;
      subject: string;
      attachments: any;
    },
    template: string = 'mail-example',
    vars: any = { message: 'message of test' }
  ) => {
    const html = await this.template.render(template, vars);
    await this.transporter.sendMail({ ...options, html });
  }
}

export default MailService;
