import { beforeEach, vi } from 'vitest';
import type { Config } from '../config/env.js';

beforeEach(() => {
  vi.mock('../lib/logger.js'); // silence logger during tests
});

export const TEST_CONFIG: Config = {
  port: 8000,
  release: 'test',
  env: 'test',
  cors: {
    hosts: [],
  },
  rateLimit: {
    windowMs: 60_000,
    max: 100,
  },
  requestTimeout: 30_000,
  sentry: {
    dsn: undefined,
    environment: 'local',
    sampleRate: 1.0,
  },
  auth: {
    clerkPublishableKey: 'pk_test_mock',
    clerkSecretKey: 'sk_test_mock',
  },
  db: {
    url: 'postgresql://test:test@localhost:5432/secrets-vault-test',
  },
};

vi.mock('../config/env.js', () => ({
  CONFIG: TEST_CONFIG,
}));
