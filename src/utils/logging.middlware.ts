import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddlware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const logger = new LoggingService(request.url.slice(1).split('/')[0]);
    const { body, method, originalUrl, query } = request;

    response.on('finish', () => {
      const { statusCode } = response;

      logger.log(
        `${method} ${originalUrl} ${statusCode} - body: ${JSON.stringify(
          body,
        )} query params: ${JSON.stringify(query)}`,
      );
    });

    next();
  }
}
