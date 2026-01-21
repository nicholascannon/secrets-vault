import * as Sentry from '@sentry/node';
import type { NextFunction, Request, Response } from 'express';

export function sentryContextMiddleware(req: Request, _res: Response, next: NextFunction) {
  Sentry.setContext('request', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    requestId: req.requestId,
  });
  next();
}
