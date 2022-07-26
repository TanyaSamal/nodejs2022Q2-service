import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { dirname, join, resolve } from 'path';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import { cwd } from 'process';
import { config } from 'dotenv';
import { HttpExceptionFilter } from './utils/exception.filter';

config({ path: resolve(cwd(), '.env') });

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const rootDirname = dirname(__dirname);
  const DOC_API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(DOC_API);

  SwaggerModule.setup('doc', app, document);

  process.on('uncaughtExceptionMonitor', (error: Error) => {
    console.error(`captured error: ${error.message}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: Error, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason.message);
    process.exit(1);
  });

  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap();
