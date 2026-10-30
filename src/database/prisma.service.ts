import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { Prisma, PrismaClient } from './prisma-client';

/** Narrow type-safe view of the generated client's event emitter. */
type TypedLogEmitter = {
  $on(event: 'query', listener: (event: Prisma.QueryEvent) => void): void;
  $on(event: 'warn' | 'error', listener: (event: Prisma.LogEvent) => void): void;
};

/**
 * Prisma client as a Nest provider. Prisma 7 goes to Postgres through the `pg` driver
 * adapter, so the connection pool belongs to `pg`. Query logs are events, see onQuery().
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');

    super({
      adapter: new PrismaPg({ connectionString }),
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });

    // `$on` is typed from the constructor options, so a small facade is easier than generics.
    const events = this as unknown as TypedLogEmitter;
    events.$on('query', (event) => this.logger.debug(`${event.duration}ms - ${event.query}`));
    events.$on('warn', (event) => this.logger.warn(event.message));
    events.$on('error', (event) => this.logger.error(event.message));
  }

  /** Used by the e2e test that counts SQL statements. */
  onQuery(listener: (event: Prisma.QueryEvent) => void): void {
    (this as unknown as TypedLogEmitter).$on('query', listener);
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Connected to PostgreSQL');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
