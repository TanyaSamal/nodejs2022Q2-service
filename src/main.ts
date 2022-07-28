import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { dirname, join, resolve } from 'path';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import { cwd } from 'process';
import { config } from 'dotenv';
import { HttpExceptionFilter } from './utils/exception.filter';
import { LoggingService } from './utils/logging.service';

config({ path: resolve(cwd(), '.env') });

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const rootDirname = dirname(__dirname);
  const DOC_API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(DOC_API);

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

process.on('uncaughtExceptionMonitor', (error: Error) => {
  const logger = new LoggingService('unhandledRejection');
  logger.error(`Captured error: ${error.message}`, error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason: Error, promise) => {
  const logger = new LoggingService('unhandledRejection');
  logger.error(
    `Unhandled Rejection at Promise: ${reason.message}`,
    reason.stack,
  );
  process.exit(1);
});

process.removeAllListeners('uncaughtException');
process.removeAllListeners('unhandledRejection');

bootstrap();
