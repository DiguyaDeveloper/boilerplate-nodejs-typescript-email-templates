import * as path from 'path';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import * as winston from 'winston';

import { Env, INCLUDE_FILENAME, MAX_FILENAME_LENGTH } from '../../api/config/constants.config';
import { env } from '../../env';

const { combine, errors, timestamp, printf, colorize } = winston.format;
/**
 * core.Log
 * ------------------------------------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 *
 * By Default it uses the debug-adapter, but you are able to change
 * this in the start up process in the core/index.ts file.
 */

export class Logger {
  public static DEFAULT_SCOPE = 'app';

  private static parsePathToScope(filepath: string): string {
    if (filepath.indexOf(path.sep) >= 0) {
      filepath = filepath.replace(process.cwd(), '');
      filepath = filepath.replace(`${path.sep}src${path.sep}`, '');
      filepath = filepath.replace(`${path.sep}dist${path.sep}`, '');
      filepath = filepath.replace('.ts', '');
      filepath = filepath.replace('.js', '');
      filepath = filepath.replace(path.sep, ':');
    }
    return filepath;
  }

  private scope: string;

  constructor(scope?: string) {
    this.scope = Logger.parsePathToScope(scope ? scope : Logger.DEFAULT_SCOPE);
  }

  public debug(message: string, ...args: any[]): void {
    this.log('debug', message, args);
  }

  public info(message: string, ...args: any[]): void {
    this.log('info', message, args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log('warn', message, args);
  }

  public error(message: string, ...args: any[]): void {
    this.log('error', message, args);
  }

  private log(level: string, message: string, args: any[]): void {
    if (winston) {
      winston[level](`${this.formatScope()} ${message}`, args);
    }
  }

  private formatScope(): string {
    return `[${this.scope}]`;
  }
}

export function getLogger(filePath: string): winston.Logger {
  let fileName = path.basename(filePath);
  fileName =
    fileName.length > MAX_FILENAME_LENGTH
      ? fileName.slice(0, MAX_FILENAME_LENGTH)
      : fileName.padEnd(MAX_FILENAME_LENGTH, ' ');

  const customFormat = printf((info) => {
    const level = `[${info.level.toUpperCase()}]`.padEnd(9, ' ');
    const source = INCLUDE_FILENAME ? fileName + ' ' : '';
    const log = `${info.timestamp} ${source}${level}${info.message}`;
    return info.stack ? `${log}\n${info.stack}` : log;
  });

  const options: winston.LoggerOptions = {
    level: env.log.level,
    format: combine(errors({ stack: true }), timestamp()),
  };

  if (env.node !== Env.test) {
    options.transports = [
      new winston.transports.File({
        filename: env.app.data_dir + '/logs/server.log',
        maxsize: 10000000,
        format: customFormat,
      }),
      new winston.transports.Console({
        format: combine(customFormat, colorize({ all: true })),
      }),
    ];
  }

  return winston.createLogger(options);
}

export class CustomTypeOrmLogger implements TypeOrmLogger {
  private logger = getLogger('TypeOrm');

  public log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner
  ): any {
    this.logger.log(level, message);
  }

  public logQuery(
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ): any {
    this.logger.debug(`Query: ${query}`);
  }

  public logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ): any {
    this.logger.warn(`The query "${query}" executed slowly in ${time}ms`);
  }

  public logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ): any {
    let message = error;
    message += `\n\tWith query: ${query}`;
    if (parameters && parameters.length > 0) {
      message += `\n\tWith params: ${parameters}`;
    }
    this.logger.error(message);
  }

  public logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    this.logger.info(message);
  }

  public logMigration(message: string, queryRunner?: QueryRunner): any {
    this.logger.info(message);
  }
}
