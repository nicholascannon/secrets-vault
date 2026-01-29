import { beforeEach, vi } from 'vitest';
import type { Config } from '../config/env.js';

beforeEach(() => {
  vi.mock('../lib/logger.js'); // silence logger during tests
});

// ============================================================================
// Auth Mocking Utilities
// ============================================================================

export const TEST_USER_ID = 'user_test123';

const mockGetAuth = vi.fn();

/** Mock an authenticated user for protected routes */
export function mockAuthenticated(userId = TEST_USER_ID) {
  mockGetAuth.mockReturnValue({ userId });
}

/** Mock an unauthenticated request */
export function mockUnauthenticated() {
  mockGetAuth.mockReturnValue({ userId: undefined });
}

vi.mock('@clerk/express', () => ({
  getAuth: (req: unknown) => mockGetAuth(req),
  clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

// ============================================================================
// Test Config
// ============================================================================

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
  encryption: {
    key: Buffer.from('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', 'base64'),
  },
  db: {
    url: 'postgresql://test:test@localhost:5432/secrets-vault-test',
    certificate: undefined,
  },
};

vi.mock('../config/env.js', () => ({
  CONFIG: TEST_CONFIG,
}));
