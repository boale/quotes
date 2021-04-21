/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as compression from 'compression';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const globalPrefix = ''; // TODO: add a global prefix when app will be an API
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(globalPrefix);
  app.use(compression());

  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${ port }/${ globalPrefix }`);
  });
}

bootstrap();
