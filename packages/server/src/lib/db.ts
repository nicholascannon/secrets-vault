import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import type { Config } from '../config/env.js';
import { PrismaClient } from '../generated/prisma/client.js';
import { LOGGER } from './logger.js';

export function createDb(config: Config) {
  if (config.db.certificate) {
    LOGGER.info('DB Certificate found, enabling SSL');
  }

  const pool = new pg.Pool({
    connectionString: config.db.url,
    max: 10,
    min: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    allowExitOnIdle: true,
    ssl: config.db.certificate
      ? {
          rejectUnauthorized: true,
          ca: config.db.certificate,
        }
      : undefined,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: config.env === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
    errorFormat: config.env === 'development' ? 'pretty' : 'colorless',
  });
}
