import 'dotenv/config';
import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../src/database/prisma.service';
import { SeedService } from '../src/database/seed/seed.service';

/**
 * `npm run db:seed` fills an empty database, `-- --force` rebuilds the profile from
 * seed-data.ts. The app does the same on startup, this script is for manual runs.
 */
async function main(): Promise<void> {
  const force = process.argv.includes('--force');
  const configService = new ConfigService(process.env);
  const prisma = new PrismaService(configService);
  const seedService = new SeedService(prisma, configService);

  try {
    await prisma.$connect();
    const result = force ? await seedService.reseed() : await seedService.seedIfNeeded();

    Logger.log(
      result === 'seeded' ? 'Seed data has been created' : 'Seed skipped: profile already exists',
      'SeedCli',
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  Logger.error(error, 'SeedCli');
  process.exitCode = 1;
});
