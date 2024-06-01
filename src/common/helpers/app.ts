import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NODE_ENV_DEVELOPMENT } from 'src/constants/string';
import { AppLogger } from './app.logger';
import { ErrorFilter } from './errors';
import { NewrelicInterceptor } from './interceptors/newrelic.interceptor';

export async function createApp(appModule: any) {
  const app = await NestFactory.create(appModule, {
    bufferLogs: true,
  });

  const logger = app.get<AppLogger>(AppLogger);
  app.useLogger(logger);

  if (process.env.NODE_ENV != NODE_ENV_DEVELOPMENT) {
    app.useGlobalInterceptors(new NewrelicInterceptor(logger));
  }

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new ErrorFilter(logger));

  return app;
}
