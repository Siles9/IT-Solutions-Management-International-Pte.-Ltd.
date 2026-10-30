import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { validationExceptionFactory } from './common/validation/validation-exception.factory';

/** HTTP setup shared by main.ts and the e2e tests, so both run with the same pipes. */
export function configureApplication(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string>('CORS_ORIGINS');

  // Sandbox is loaded from the Apollo CDN, and the page itself may be embedded elsewhere.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      frameguard: false,
    }),
  );
  app.enableCors({
    origin: corsOrigins
      ? corsOrigins
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean)
      : true,
    methods: ['GET', 'POST', 'OPTIONS'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.enableShutdownHooks();
}
