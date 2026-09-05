import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: AppLogger) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const { method, originalUrl } = request;
        const startTime = Date.now();

        return next.handle().pipe(
            tap({
                next: () => {
                    const duration = Date.now() - startTime;

                    this.logger.log(
                        `${method} ${originalUrl} ${response.statusCode} ${duration}ms`,
                    );
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    const statusCode = error?.status || error?.statusCode || 500;

                    this.logger.error(
                        `${method} ${originalUrl} ${statusCode} ${duration}ms`,
                        error?.message,
                    );
                },
            }),
        );
    }
}