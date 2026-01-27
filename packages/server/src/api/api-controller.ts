import { clerkMiddleware } from '@clerk/express';
import type { NotFoundResponse, TooManyRequestsResponse } from '@secrets-vault/shared/api/errors';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import expressRateLimit, { ipKeyGenerator } from 'express-rate-limit';
import type { Config } from '../config/env.js';
import { Controller } from '../lib/controller.js';
import { zodErrorHandler } from '../middleware/zod-error-handler.js';
import { FileController } from './file/file-controller.js';
import type { FileRepo } from './file/file-repo.js';
import { FileService } from './file/file-service.js';
import { HealthController } from './health/health-controller.js';
import type { HealthRepository } from './health/health-repository.js';

export type ApiDependencies = {
  healthRepository: HealthRepository;
  fileRepository: FileRepo;
};

/**
 * API controller that handles the API routes for the application.
 */
export class ApiController extends Controller {
  constructor(dependencies: ApiDependencies, config: Config) {
    super();

    const { healthRepository, fileRepository } = dependencies;

    const healthController = new HealthController(healthRepository);
    const fileService = new FileService(fileRepository, config.encryption.key);
    const fileController = new FileController(fileService);

    this.router.use(express.json({ limit: '100kb', strict: true }));
    this.router.use(express.urlencoded({ extended: true, limit: '100kb' }));
    if (config.cors.hosts.length > 0) {
      this.router.use(cors({ origin: config.cors.hosts }));
    }

    this.router.use(
      '/v1/health',
      this.rateLimiter({
        ...config.rateLimit,
        max: config.rateLimit.max * 3, // 3x the max for health check
      }),
      healthController.router
    );

    this.router.use(this.rateLimiter(config.rateLimit));
    this.router.use(clerkMiddleware());

    /* API ROUTES HERE */
    this.router.use('/v1/files', fileController.router);

    this.router.use(this.notFoundHandler);
    this.router.use(zodErrorHandler);
  }

  private rateLimiter = ({ windowMs, max }: Config['rateLimit']) =>
    expressRateLimit({
      windowMs,
      max,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        // Use Cloudflare's real IP if available, fallback to Express's trust proxy handling
        const ip = (req.headers['cf-connecting-ip'] as string) || req.ip || 'unknown';
        return ip === 'unknown' ? ip : ipKeyGenerator(ip);
      },
      handler: (req, res) => {
        return res.status(429).json<TooManyRequestsResponse>({
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests from this IP, please try again later.',
          },
          meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
        });
      },
    });

  private notFoundHandler = (req: Request, res: Response) => {
    return res.status(404).json<NotFoundResponse>({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        details: {
          path: req.originalUrl,
          method: req.method,
        },
      },
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    });
  };
}
