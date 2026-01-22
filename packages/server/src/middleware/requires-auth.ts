import { getAuth } from '@clerk/express';
import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../lib/errors.js';

/**
 * Middleware that requires authentication via Clerk.
 * Sets `req.userId` on authenticated requests.
 * Passes `UnauthorizedError` to next() if not authenticated.
 */
export function requiresAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = getAuth(req);
  if (!auth.userId) {
    return next(new UnauthorizedError());
  }
  req.userId = auth.userId;
  next();
}

/**
 * Helper to get userId from request in protected routes.
 * Throws `UnauthorizedError` if userId is not present.
 * Use this as a safety net in routes that have `requiresAuth` middleware.
 */
export function getUserId(req: Request): string {
  if (!req.userId) {
    throw new UnauthorizedError();
  }
  return req.userId;
}
