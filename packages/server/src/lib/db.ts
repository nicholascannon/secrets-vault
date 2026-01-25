import { PrismaPg } from '@prisma/adapter-pg';
import type { Config } from '../config/env.js';
import { PrismaClient } from '../generated/prisma/client.js';

export function createDb(config: Config) {
  // Check if connection string requires SSL (common with managed DBs like Fly.io, Supabase, etc.)
  const requiresSsl = config.db.url.includes('sslmode=require');

  const adapter = new PrismaPg({
    connectionString: config.db.url,
    max: 10,
    min: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    allowExitOnIdle: true,
    // Accept self-signed certificates when SSL is required
    ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
  });

  return new PrismaClient({
    adapter,
    log: config.env === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
    errorFormat: config.env === 'development' ? 'pretty' : 'colorless',
  });
}
