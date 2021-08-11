/**
 * App entry
 * @file Index 入口文件
 * @module app/main
 */
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@app/pipes/validation.pipe';
import { HttpExceptionFilter } from '@app/filters/error.filter';
import { TransformInterceptor } from '@app/interceptors/transform.interceptor';
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor';
import { ErrorInterceptor } from '@app/interceptors/error.interceptor';
import { environment, isProdMode, isDevMode } from '@app/app.environment';
import * as APP_CONFIG from '@app/app.config';

// 替换 console 为更统一友好的
const { log, warn, info } = console;
const color = (c) => (isDevMode ? c : '');
Object.assign(global.console, {
  log: (...args) => log('[log]', `[${APP_CONFIG.PROJECT.name}]`, ...args),
  warn: (...args) =>
    warn(
      color('\x1b[33m%s\x1b[0m'),
      '[warn]',
      `[${APP_CONFIG.PROJECT.name}]`,
      ...args,
    ),
  info: (...args) =>
    info(
      color('\x1b[34m%s\x1b[0m'),
      '[info]',
      `[${APP_CONFIG.PROJECT.name}]`,
      ...args,
    ),
  error: (...args) =>
    info(
      color('\x1b[31m%s\x1b[0m'),
      '[error]',
      `[${APP_CONFIG.PROJECT.name}]`,
      ...args,
    ),
});

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    isProdMode ? { logger: false } : null,
  );
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(rateLimit({ max: 1000, windowMs: 15 * 60 * 1000 }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    new ErrorInterceptor(new Reflector()),
    new LoggingInterceptor(),
  );
  return await app.listen(3000);
}
bootstrap().then(() => {
  console.info(
    `NodeServer Run！port at ${APP_CONFIG.APP.PORT}, env: ${environment}`,
  );
});
