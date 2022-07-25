import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingService implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { body, method, originalUrl, query } = request;

    response.on('finish', () => {
      const { statusCode } = response;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - body: ${JSON.stringify(
          body,
        )} query params: ${JSON.stringify(query)}`,
      );
    });

    next();
  }
}
