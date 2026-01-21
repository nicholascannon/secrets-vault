import * as Sentry from '@sentry/node';
import { CONFIG } from '../config/env.js';
import { LOGGER } from './logger.js';

Sentry.init({
  dsn: CONFIG.sentry.dsn,
  environment: CONFIG.sentry.environment,
  release: CONFIG.release,
  enabled: ['staging', 'production'].includes(CONFIG.sentry.environment),
  sampleRate: CONFIG.sentry.sampleRate,
  sendDefaultPii: true,
  // Ignore common non-actionable errors
  ignoreErrors: ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT'],
});

if (Sentry.isInitialized()) {
  LOGGER.info('Sentry initialized', {
    enabled: Sentry.isEnabled(),
    environment: CONFIG.sentry.environment,
    release: CONFIG.release,
    sampleRate: CONFIG.sentry.sampleRate,
  });
}
