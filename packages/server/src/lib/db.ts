import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import type { Config } from '../config/env.js';
import { PrismaClient } from '../generated/prisma/client.js';

export function createDb(config: Config) {
  // Check if connection string requires SSL (common with managed DBs like Fly.io, Supabase, etc.)
  const requiresSsl = config.db.url.includes('sslmode=require');

  const pool = new pg.Pool({
    connectionString: config.db.url,
    max: 10,
    min: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    allowExitOnIdle: true,
    ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: config.env === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
    errorFormat: config.env === 'development' ? 'pretty' : 'colorless',
  });
}
