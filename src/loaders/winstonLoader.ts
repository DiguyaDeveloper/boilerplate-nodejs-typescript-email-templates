import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as winston from 'winston';

import { env } from '../env';

const INCLUDE_FILENAME = false;
const MAX_FILENAME_LENGTH = 20;

export const winstonLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
) => {
  let fileName = 'log';
  fileName =
    fileName.length > MAX_FILENAME_LENGTH
      ? fileName.slice(0, MAX_FILENAME_LENGTH)
      : fileName.padEnd(MAX_FILENAME_LENGTH, ' ');

  const customFormat = winston.format.printf((info) => {
    const level = `[${info.level.toUpperCase()}]`.padEnd(9, ' ');
    const source = INCLUDE_FILENAME ? fileName + ' ' : '';
    const log = `${info.timestamp} ${source}${level}${info.message}`;
    return info.stack ? `${log}\n${info.stack}` : log;
  });
  winston.configure({
    transports: [
      new winston.transports.Console({
        level: env.log.level,
        handleExceptions: true,
        format:
          env.node !== 'development'
            ? winston.format.combine(winston.format.json())
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
              ),
      }),
      new winston.transports.File({
        filename: env.app.data_dir + '/logs/server.log',
        maxsize: 10000000,
        format: customFormat,
      }),
    ],
  });
};
