import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class LoggerWinston implements LoggerService {
  constructor(private readonly configService: ConfigService) {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      defaultMeta: { service: 'App' },
      transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.Console({ level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
      ]
    });

    if (this.configService.get<string>('NODE_ENV') !== 'production') {
      this.logger.add(new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple(),
        ),
      }));
    }
  }

  private logger;

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message);
  }
}