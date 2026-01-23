import { PrismaPg } from '@prisma/adapter-pg';
import type { Config } from '../config/env.js';
import { PrismaClient } from '../generated/prisma/client.js';

export function createDb(config: Config) {
  const adapter = new PrismaPg({
    connectionString: config.db.url,
    max: 10,
    min: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    allowExitOnIdle: true,
  });

  return new PrismaClient({
    adapter,
    log: config.env === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
    errorFormat: config.env === 'development' ? 'pretty' : 'colorless',
  });
}
