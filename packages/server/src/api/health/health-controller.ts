import type { HealthLivenessResponse, HealthReadinessResponse } from '@secrets-vault/shared/api/health';
import type { Request, Response } from 'express';
import { CONFIG } from '../../config/env.js';
import { Controller } from '../../lib/controller.js';
import type { HealthRepository } from './health-repository.js';

export class HealthController extends Controller {
  constructor(private readonly healthCheckRepo: HealthRepository) {
    super();

    this.router.get('/', this.liveness);
    this.router.get('/ready', this.readiness);
  }

  /**
   * Always returns 200 if app is running.
   */
  private liveness = async (req: Request, res: Response) => {
    return res.status(200).json<HealthLivenessResponse>({
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
    const { isHealthy, db, clerk } = await this.healthCheckRepo.checkHealth();

    const statusCode = isHealthy ? 200 : 503;
    return res.status(statusCode).json<HealthReadinessResponse>({
      data: {
        version: CONFIG.release,
        db,
        clerk,
      },
      meta: {
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
      },
    });
  };
}
