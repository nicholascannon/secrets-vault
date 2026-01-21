import { join } from 'node:path';
import type { NotFoundResponse } from '@secrets-vault/shared/api/errors';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import { LOGGER } from './logger.js';

/**
 * Statically serves the frontend application at bundlePath.
 */
export function serveFrontend(app: Application, bundlePath: string) {
  LOGGER.info('Serving frontend bundle', { bundlePath });

  const indexHtml = join(bundlePath, 'index.html');

  app.use(express.static(bundlePath));

  app.use((req: Request, res: Response, next: NextFunction) => {
    // Skip if not a GET request or if it's an API route
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      return next();
    }

    // Return 404 for any file request (static middleware will handle it)
    if (req.path.includes('.')) {
      return res.status(404).json<NotFoundResponse>({
        success: false,
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
    }

    return res.sendFile(indexHtml, (error) => {
      if (error) {
        LOGGER.error('Error sending frontend index.html', { error, indexHtml, bundlePath });
        if (!res.headersSent) {
          next(error);
        }
      }
    });
  });
}
