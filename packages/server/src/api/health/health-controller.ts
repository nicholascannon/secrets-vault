import type { HealthLivenessResponse, HealthReadinessResponse } from '@secrets-vault/shared/api/health';
import { type Request, type Response, Router } from 'express';
import { CONFIG } from '../../config/env.js';
import type { Controller } from '../../lib/controller.js';
import type { HealthRepository } from './health-repository.js';

export class HealthController implements Controller {
  public readonly router: Router;

  constructor(private readonly healthCheckRepo: HealthRepository) {
    this.router = Router();
    this.router.get('/', this.liveness);
    this.router.get('/ready', this.readiness);
  }

  /**
   * Always returns 200 if app is running.
   */
  private liveness = async (req: Request, res: Response) => {
    return res.status(200).json<HealthLivenessResponse>({
      success: true,
      data: {
        version: CONFIG.release,
        message: 'ok',
      },
      meta: {
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
      },
    });
  };

  /**
   * Returns 200 if dependencies are healthy, 503 if not.
   */
  private readiness = async (req: Request, res: Response) => {
    const { isHealthy, db } = await this.healthCheckRepo.checkHealth();

    const statusCode = isHealthy ? 200 : 503;
    return res.status(statusCode).json<HealthReadinessResponse>(
      isHealthy
        ? {
            success: true,
            data: {
              version: CONFIG.release,
              db: 'ok',
            },
            meta: {
              requestId: req.requestId,
              timestamp: new Date().toISOString(),
            },
          }
        : {
            success: false,
            data: {
              version: CONFIG.release,
              db: db?.message || 'ok',
            },
            error: {
              code: 'HEALTH_READINESS_CHECK_FAILED',
              message: 'Health readiness check failed',
            },
            meta: {
              requestId: req.requestId,
              timestamp: new Date().toISOString(),
            },
          }
    );
  };
}
