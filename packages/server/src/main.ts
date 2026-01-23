import 'dotenv/config';
import './lib/instrument.js'; // import first
import { createClerkClient } from '@clerk/express';
import { HealthCheckRepoImpl } from './api/health/repositories/health-check-repo-impl.js';
import { createApp } from './app.js';
import { CONFIG } from './config/env.js';
import { createDb } from './lib/db.js';
import { lifecycle } from './lib/lifecycle.js';
import { LOGGER, setupProcessLogging } from './lib/logger.js';

setupProcessLogging();

LOGGER.info('CONFIG', {
  config: {
    env: CONFIG.env,
    release: CONFIG.release,
    port: CONFIG.port,
    cors: CONFIG.cors,
    rateLimit: CONFIG.rateLimit,
    requestTimeout: CONFIG.requestTimeout,
    sentry: {
      environment: CONFIG.sentry.environment,
      sampleRate: CONFIG.sentry.sampleRate,
    },
  },
});

const db = createDb(CONFIG);
const clerkClient = createClerkClient({ secretKey: CONFIG.auth.clerkSecretKey });

const app = createApp({
  apiDependencies: {
    healthRepository: new HealthCheckRepoImpl(db, clerkClient),
  },
}).listen(CONFIG.port, () => {
  LOGGER.info('Server started', { port: CONFIG.port });

  lifecycle.on('close', () =>
    app.close(() => {
      LOGGER.info('Server closed');

      // only close DB after closing the server
      db.$disconnect().then(() => LOGGER.info('Database connection closed'));
    })
  );
});
