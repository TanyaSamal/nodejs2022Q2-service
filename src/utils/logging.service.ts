import { LoggerService } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { dirname, join } from 'path';
import * as winston from 'winston';
import * as dotenv from 'dotenv';
import { LOG_LEVELS } from './consts';

dotenv.config();
const loggerLevel = process.env.LOG_LEVEL || 2;
const rootDirname = dirname(__dirname);

const { errors, combine, json, timestamp, ms, prettyPrint } = winston.format;

export class LoggingService implements LoggerService {
  private logger: winston.Logger;

  constructor(service?) {
    this.logger = winston.createLogger({
      format: combine(
        errors({ stack: true }),
        json(),
        timestamp({ format: 'isoDateTime' }),
        ms(),
        prettyPrint(),
      ),
      defaultMeta: { service },
      transports: [
        new winston.transports.File({
          level: 'error',
          filename: `error.log`,
          dirname: join(rootDirname, './../logs/'),
          maxsize: 5000000,
        }),
        new winston.transports.Console({
          level: 'debug',
          format: combine(nestWinstonModuleUtilities.format.nestLike()),
        }),

        new winston.transports.File({
          level: 'info',
          filename: `combined.log`,
          dirname: join(rootDirname, './../logs/'),
          maxsize: 5000000,
        }),
      ],
      exceptionHandlers: [
        new winston.transports.File({
          level: 'error',
          filename: 'exception.log',
          dirname: join(rootDirname, './../logs/'),
          maxsize: 5000000,
        }),
      ],
      rejectionHandlers: [
        new winston.transports.File({
          level: 'error',
          filename: 'rejections.log',
          dirname: join(rootDirname, './../logs/'),
          maxsize: 5000000,
        }),
      ],
    });
  }

  log(message: string) {
    if (loggerLevel >= LOG_LEVELS.info) this.logger.info(message);
  }

  error(message: string, trace: string) {
    if (loggerLevel >= LOG_LEVELS.error) this.logger.error(message, trace);
  }

  warn(message: string) {
    if (loggerLevel >= LOG_LEVELS.warn) this.logger.warning(message);
  }

  debug(message: string) {
    if (loggerLevel >= LOG_LEVELS.debug) this.logger.debug(message);
  }

  verbose(message: string) {
    if (loggerLevel >= LOG_LEVELS.verbose) this.logger.verbose(message);
  }
}
