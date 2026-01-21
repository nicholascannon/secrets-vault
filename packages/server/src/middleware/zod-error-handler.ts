import type { InvalidRequestResponse } from '@secrets-vault/shared/api/errors';
import type { NextFunction, Request, Response } from 'express';
import * as z from 'zod';

// biome-ignore lint/suspicious/noExplicitAny: required to match express error handler type
export const zodErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!(err instanceof z.ZodError)) return next(err);

  return res.status(400).json<InvalidRequestResponse>({
    success: false,
    error: {
      code: 'INVALID_REQUEST',
      message: 'Invalid request',
      details: z.flattenError(err).fieldErrors,
    },
    meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
  });
};
