import type express from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_CONFIG } from '../config/testing.js';

vi.mock('../lib/frontend', () => ({
  serveFrontend: vi.fn(),
}));

vi.mock('../config/env.js', () => ({
  CONFIG: {
    ...TEST_CONFIG,
    env: 'production',
  },
}));

import { HealthCheckMemoryRepo } from '../api/health/repositories/health-check-memory-repo.js';
import { createApp } from '../app.js';
import { serveFrontend } from '../lib/frontend.js';

describe('createApp in production', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('serves the frontend when env is production', () => {
    const app: express.Application = createApp({
      enableLogging: false,
      apiDependencies: {
        healthRepository: new HealthCheckMemoryRepo(),
      },
    });

    expect(serveFrontend).toHaveBeenCalledTimes(1);
    // Verify it was called with app and a path ending in frontend/dist
    expect(serveFrontend).toHaveBeenCalledWith(app, expect.stringMatching(/frontend\/dist$/));
  });
});
