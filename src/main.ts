import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { configureApplication } from './app.setup';
import { NodeEnvironment } from './config/environment';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.LOG_LEVEL === 'debug'
        ? ['error', 'warn', 'log', 'debug']
        : ['error', 'warn', 'log'],
  });

  configureApplication(app);

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(`GraphQL API:    http://localhost:${port}/graphql`);
  logger.log(`Apollo Sandbox: http://localhost:${port}/`);
  logger.log(`Health check:   http://localhost:${port}/health`);

  if (
    configService.get('NODE_ENV') !== NodeEnvironment.Production &&
    !configService.get('MUTATION_API_KEY')
  ) {
    logger.warn('MUTATION_API_KEY is not set: mutations are open (fine for a public demo).');
  }
}

bootstrap().catch((error: unknown) => {
  Logger.error(error, 'Bootstrap');
  process.exitCode = 1;
});
