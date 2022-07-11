import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { dirname, join, resolve } from 'path';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import { cwd } from 'process';
import { config } from 'dotenv';

config({ path: resolve(cwd(), '.env') });

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rootDirname = dirname(__dirname);
  const DOC_API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(DOC_API);

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
}

bootstrap();
