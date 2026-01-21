import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../../app.js';
import { HealthCheckMemoryRepo } from '../repositories/health-check-memory-repo.js';

describe('HealthController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/health/', () => {
    it('should return 200 with liveness response', async () => {
      const healthRepo = new HealthCheckMemoryRepo();
      const app = createApp({
        enableLogging: false,
        apiDependencies: { healthRepository: healthRepo },
      });

      const response = await request(app).get('/api/v1/health/').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: 'ok',
        },
        meta: {
          requestId: expect.any(String),
          timestamp: expect.any(String),
        },
      });
      expect(response.body.meta.requestId).toBeTruthy();
      expect(new Date(response.body.meta.timestamp).toISOString()).toBe(response.body.meta.timestamp);
    });

    it('should always return 200 regardless of health status', async () => {
      const healthRepo = new HealthCheckMemoryRepo();
      healthRepo.setHealth(false);
      const app = createApp({
        enableLogging: false,
        apiDependencies: { healthRepository: healthRepo },
      });

      await request(app).get('/api/v1/health/').expect(200);
    });
  });

  describe('GET /api/v1/health/ready', () => {
    it('should return 200 when healthy', async () => {
      const healthRepo = new HealthCheckMemoryRepo();
      healthRepo.setHealth(true);
      const app = createApp({
        enableLogging: false,
        apiDependencies: { healthRepository: healthRepo },
      });

      const response = await request(app).get('/api/v1/health/ready').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          db: 'ok',
        },
        meta: {
          requestId: expect.any(String),
          timestamp: expect.any(String),
        },
      });
      expect(response.body.error).toBeUndefined();
    });

    it('should return 503 when unhealthy', async () => {
      const healthRepo = new HealthCheckMemoryRepo();
      healthRepo.setHealth(false);
      const app = createApp({
        enableLogging: false,
        apiDependencies: { healthRepository: healthRepo },
      });

      const response = await request(app).get('/api/v1/health/ready').expect(503);

      expect(response.body).toMatchObject({
        success: false,
        data: {
          db: expect.any(String),
        },
        error: {
          code: 'HEALTH_READINESS_CHECK_FAILED',
          message: 'Health readiness check failed',
        },
        meta: {
          requestId: expect.any(String),
          timestamp: expect.any(String),
        },
      });
    });

    it('should include requestId in meta', async () => {
      const healthRepo = new HealthCheckMemoryRepo();
      const app = createApp({
        enableLogging: false,
        apiDependencies: { healthRepository: healthRepo },
      });

      const response = await request(app)
        .get('/api/v1/health/ready')
        .set('x-request-id', 'custom-request-id')
        .expect(200);

      expect(response.body.meta.requestId).toBe('custom-request-id');
    });

    it('should generate requestId if not provided', async () => {
      const healthRepo = new HealthCheckMemoryRepo();
      const app = createApp({
        enableLogging: false,
        apiDependencies: { healthRepository: healthRepo },
      });

      const response = await request(app).get('/api/v1/health/ready').expect(200);

      expect(response.body.meta.requestId).toBeTruthy();
      expect(typeof response.body.meta.requestId).toBe('string');
    });
  });
});
