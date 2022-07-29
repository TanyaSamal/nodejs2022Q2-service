import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();
const salt = process.env.CRYPT_SALT || 10;

@Injectable()
export class LoggingMiddlware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const logger = new LoggingService(request.url.slice(1).split('/')[0]);
    const { body, method, originalUrl, query } = request;

    response.on('finish', async () => {
      const { statusCode } = response;

      if (body.password) {
        body.password = await bcrypt.hash(String(body.password), Number(salt));
      }

      logger.log(
        `${method} ${originalUrl} ${statusCode} - body: ${JSON.stringify(
          body,
        )} query params: ${JSON.stringify(query)}`,
      );
    });

    next();
  }
}
