import 'dotenv/config';

import { defineConfig } from 'prisma/config';

/**
 * Prisma 7 keeps CLI/runtime configuration in TypeScript instead of `schema.prisma`.
 *
 * `DATABASE_URL` is validated strictly by the application itself (`ConfigModule`), while
 * the Prisma CLI falls back to a local placeholder: `prisma generate` runs as a postinstall
 * hook and during Docker builds, where no database is reachable.
 */
const LOCAL_PLACEHOLDER_URL = 'postgresql://postgres:postgres@localhost:5432/business_card?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? LOCAL_PLACEHOLDER_URL,
  },
});
