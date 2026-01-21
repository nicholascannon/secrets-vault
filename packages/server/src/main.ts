import 'dotenv/config';
import './lib/instrument.js'; // import first
import { HealthCheckMemoryRepo } from './api/health/repositories/health-check-memory-repo.js';
import { createApp } from './app.js';
import { CONFIG } from './config/env.js';
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

const app = createApp({
  apiDependencies: {
    healthRepository: new HealthCheckMemoryRepo(), // TODO: Use a real repository when DB setup
  },
}).listen(CONFIG.port, () => {
  LOGGER.info('Server started', { port: CONFIG.port });

  lifecycle.on('close', () =>
    app.close(() => {
      LOGGER.info('Server closed');
    })
  );
});
