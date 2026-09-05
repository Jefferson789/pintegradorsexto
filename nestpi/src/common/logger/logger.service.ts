import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class AppLogger implements LoggerService {
    private readonly logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
                }),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                }),
                new winston.transports.File({
                    filename: 'logs/application.log',
                }),
            ],
        });
    }

    log(message: string) {
        this.logger.info(message);
    }

    error(message: string, trace?: string) {
        this.logger.error(
            `${message}${trace ? ` | ${trace}` : ''}`,
        );
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    verbose(message: string) {
        this.logger.verbose(message);
    }
}